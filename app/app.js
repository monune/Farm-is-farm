const express = require('express');
const app = express();
const port = 3000;

app.get('/',(req,res)=>res.send('Server Start'));

app.listen(port, ()=>console.log(`Server Start. Port : ${port}`))

const mysql = require('./database')();

const connection = mysql.init();

mysql.db_open(connection);
const puppeteer = require('puppeteer'); // 아아 나의 구원자
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs'); // 콘솔 작성

const using_url = "https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query="; // naver
let saveWeatherLog = '';

const getHTML = async (keyword) => {
	try {
	  return await axios.get(using_url + encodeURI(keyword));
	} catch (err) {
	  console.error(err);
	  throw err;
	}
  };

/**
 * 전체 날씨 (날씨 정보, 예상 습도) 데이터를 가져오는 함수 (최상위)
 * @param {string} serchKeyword 검색 키워드
 */
const parsing = async (serchKeyword) => {
	try {
	    const html = await getHTML(serchKeyword);
	    const $ = cheerio.load(html.data);

	    // Query 설정
	    const $weather = $(".status_wrap");
	    const temperature = $weather.find("._today .temperature_text strong:eq(0)").text();
	    const summaryList = $weather.find(".summary_list .sort").text();
	    const weatherData = [];

	  	// Class 계산
	  	const imgArr1 = $weather.find("._today .weather_graphic .weather_main i").attr("class");
	  	const imgArr2 = imgArr1.split(" "); // 공백 제거
	  	const weatherClass = imgArr2[1].split("_"); // _ 제거

	    // 날씨 데이터 계산
		for (let i = 0; i < 4; i++) {
			const today = $weather.find(`li.item_today a:eq(${i})`).text().trim().split(" ");
			weatherData.push(today[1]);
		}

		const splitSummry = summaryList.trim().split(" ");
		const splitTemp = temperature.trim().split(" ");
		const tempReplace = String(splitTemp[1]).replace(/^온도/, "");

		const Summary = [];
		if (splitSummry && splitSummry.length > 0) {
			for (let i = 0; i < splitSummry.length; i++) {
			if (splitSummry[i] && splitSummry[i].endsWith("°")) Summary[0] = splitSummry[i];
				else if (splitSummry[i] && splitSummry[i].endsWith("mm")) Summary[1] = splitSummry[i];
				else if (splitSummry[i] && splitSummry[i].endsWith("%")) Summary[2] = splitSummry[i];
				else if (splitSummry[i] && splitSummry[i].endsWith("풍")) Summary[3] = splitSummry[i];
				else if (splitSummry[i] && splitSummry[i].endsWith("m/s")) Summary[4] = splitSummry[i];
			}
		}

		// docs 가져오기
		const puppeteerResult = await callPuppetter(serchKeyword, "li.data .num");
		// times 가져오기
		const loop = 24 + (24 - new Date().getHours());
		const soltArray = await expectionHumidity(".humidity_graph_box .climate_box ", loop, `.time_wrap .time span.text`);

		const weatherValues = [tempReplace, ...Summary.slice(0, 5), ...weatherData.slice(0, 4), weatherClass[1]];
		const weatherColumns = [ 
			'temperature', 'filling_temperature', 'meteoric_water', 'humidity',
			'wind_direction', 'wind_speed', 'fine_dust', 'super_fine_dust', 
			'ultraviolet_rays', 'sunset', 'class' 
		];
	
		const humidityJsonData = JSON.stringify({ data: puppeteerResult }); // docs
		const soltJsonData = JSON.stringify({ data: soltArray }); // times
	
		// update Database
		await updateDatabase('iemh_team1.weather', weatherColumns, weatherValues);
		await updateDatabase('iemh_team1.realtime_humidity', ['docs', 'times'], [humidityJsonData, soltJsonData] );
	} catch (error) {
		console.error('An error occurred:', error);
	}
};

/**
 * 복수 클래스를 가진 객체의 데이터를 저장하는 함수
 * @param {string} serchKeyword 검색 키워드
 * @param {string} selectHighClass 검색할 상위 클래스
 * @param {int} loopCountValue 반복시켜 배열에 저장할 횟수
 * @param {string} queryString Query문 내부에서 작성할 변수
 */
const expectionHumidity = async (selectHighClass, loopCountValue, queryString) => {
	const html = await getHTML(`날씨`);
	const $ = cheerio.load(html.data);
	const pluralArray = [];
	const $dataItems = $(selectHighClass);
	for (let i = 0; i < loopCountValue; i++) {
		const tarr = $dataItems.find(queryString + `:eq(${i})`).text(); // query문에 변수 쓰는 방법 알아보기
		pluralArray.push(tarr);
	}
	return pluralArray;
}

const intervalCounter = 1000 * 60; // 1s = 1000
setInterval(() => {
	parsing(`날씨`);
	// saveLogToFile('savedWeatherInfo.txt', saveWeatherLog);
}, intervalCounter);

/**
 * 데이터베이스 업데이트하는 함수
 * @param {database_table} table 
 * @param {Array} columns 
 * @param {value} values 업데이트할 데이터
 * @param {boolean} callback 
 */
const updateDatabase = (table, columns, values) => {
    return new Promise((resolve, reject) => {
    	const placeholders = columns.map(column => `${column} = ?`).join(', ');
    	const sql = `UPDATE ${table} SET ${placeholders}`;
    	connection.query(sql, values, (error, results) => {
    		if (error) {
    		    console.error(error);
    		    reject(error);
    		} else {
    		    resolve(results);
    		}
    	});
  	});
};

/**
 * 원하는 정보를 검색하고 배열로 반환하는 Puppetter 노드 라이브러리를 사용한 함수입니다. 
 * @param {string} serchKeyword 검색할 키워드
 * @param {string} classKeyword 찾고싶은 클래스
 * @returns {array} 최대 다음날 습도 예상값 까지 반환
 */
const callPuppetter = async (serchKeyword, classKeyword) => {  
	const browser = await puppeteer.launch({ headless: "new" });
	const page = await browser.newPage();
	await page.goto(using_url + encodeURI(serchKeyword));
  
	const PuppteerArray = await page.evaluate((classKeyword) => {
		const numElements = Array.from(document.querySelectorAll(classKeyword));
		const numbers = numElements.map(element => parseInt(element.textContent, 10));
	
		const filteredNumbers = numbers.filter(number => number >= 10);
		const desiredLength = 24 + (24 - new Date().getHours());
		while (filteredNumbers.length < desiredLength) filteredNumbers.push(0);
		if (filteredNumbers.length > desiredLength) filteredNumbers.length = desiredLength;

		return filteredNumbers;
	}, classKeyword);
	await browser.close(); // 브라우저 인스턴스 제거
	return PuppteerArray;
};

/**
 * 작성된 환경 기록을 저장하는 코드입니다.
 * @param {string} filename 저장할 파일 이름
 * @param {string} text 새로운 열에 기록할 정보
 */
const saveLogToFile = (filename, text) => {
	fs.readFile(filename, 'utf8', (err, data) => {
	  	if (err) {
			console.error(err);
			return callback(err);
	  	}
		
	  	const newText = data + '\n' + text;
	  	fs.writeFile(filename, newText, 'utf8', (err) => {
			if (err) {
			  console.error(err);
			  return callback(err);
			}
		
			console.log('텍스트가 성공적으로 작성되었습니다.');
	  	});
	});
}