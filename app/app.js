// netstat -ano | findstr :<PORT_NUMBER>
// taskkill /PID <PID> /F

const express = require('express');
const app = express();
const port = 3000;

app.get('/',(req,res)=>res.send('Server Start'));

app.listen(port, ()=>console.log(`Server Start. Port : ${port}`))

const mysql = require('./database')();

const connection = mysql.init();

mysql.db_open(connection);
const puppeteer = require('puppeteer'); // 아아 나의 구원자
const cheerio = require('cheerio');     // 
const axios = require('axios');

const getHTML = async (keyword) => {
  try {
    return await axios.get("https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=" + encodeURI(keyword));
  } catch (err) {
    console.log(err);
  }
};

// parsing 성공 
const parsing = async (keyword) => {

  const html = await getHTML(keyword);
  const $ = cheerio.load(html.data);

  // Query 설정
  const $weather = $(".status_wrap");
  const temperature = $weather.find("._today .temperature_text strong:eq(0)").text();
  const summaryList = $weather.find(".summary_list .sort").text();
  const weatherData = [];

  // Class 계산
  const img = $weather.find("._today .weather_graphic .weather_main i").attr("class");
  const textArray = img.split(" "); // 공백 제거
  const imgClass = textArray[1].split("_"); // _ 제거

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

  // 예상 습도 (시간) 가져오기
  const today = new Date();
  const timeArray = [];
  const $dataItems = $(".humidity_graph_box .climate_box ");
  for (let i = 0; i < 24 + (24 - today.getHours()); i++) {
    const tarr = $dataItems.find(`.time_wrap .time span.text:eq(${i})`).text();
    timeArray.push(tarr);
  }
  const Hpup_1 = await pup();
  console.log("---------------------------------------")
  console.log(timeArray);
  console.log(Hpup_1);

  //
  const weatherValues = [tempReplace, ...Summary.slice(0, 5), ...weatherData.slice(0, 4), imgClass[1]];
  const weatherColumns = [ 
    'temperature', 'filling_temperature', 'meteoric_water', 'humidity',
    'wind_direction', 'wind_speed', 'fine_dust', 'super_fine_dust', 
    'ultraviolet_rays', 'sunset', 'class' 
  ];
  
  //
  const jsonData = JSON.stringify({ data: Hpup_1 });
  const humidityColumns = ['docs'];
  const humidityValues = [jsonData];
  
  //
  const jsonData2 = JSON.stringify({ data: timeArray });
  const timesColums = ['times'];
  const timeValues = [jsonData2];
  
  // DB 갱신
  updateDatabase('iemh_team1.weather', weatherColumns, weatherValues);
  updateDatabase('iemh_team1.realtime_humidity', humidityColumns, humidityValues);
  updateDatabase('iemh_team1.realtime_humidity', timesColums, timeValues);
  
};

setInterval(() => {
  parsing(`날씨`);
}, 10000);

/**
 * 데이터베이스 업데이트하는  함수
 * @param {database_table} table 
 * @param {array} columns 
 * @param {value} values 
 * @param {*} callback 
 */
 function updateDatabase(table, columns, values, callback) {
  const placeholders = columns.map(column => `${column} = ?`).join(', ');
  const sql = `UPDATE ${table} SET ${placeholders}`;
  connection.query(sql, values, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      // console.log("success Table: " + table + ", Values: " + values);
    }
    if (typeof callback === 'function') {
      callback(error, results);
    }
  });
}

/**
 * puppetter 노드 라이브러리를 이용한 크롤링 함수
 * @returns {array} 필터링된 배열 값
 */
const pup = async () => {  
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  const url = 'https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=%EB%82%A0%EC%94%A8';
  await page.goto(url);
  
  const PuppteerArray = page.evaluate(() => {
    const numElements = Array.from(document.querySelectorAll('li.data .num'));
    const numbers = numElements.map(element => parseInt(element.textContent, 10));
    const filteredNumbers = numbers.filter(number => number >= 10);
    const desiredLength = 24 + (24 - new Date().getHours());

    // 10 미만의 숫자를 0으로 채웁니다.
    while (filteredNumbers.length < desiredLength) filteredNumbers.push(0);
    // 배열의 길이가 원하는 길이보다 더 길다면 잘라냅니다.
    if (filteredNumbers.length > desiredLength) filteredNumbers.length = desiredLength;
    return filteredNumbers;
  });
  return PuppteerArray;
};

/**
 * 배열을 JSON 형식으로 변환하는 함수
 * @param {array} arr 
 */
const changeJSON = (arr) => {
  let data = JSON.stringify(arr); // '["Apple","Banana","Orange"]' // 배열 문자열
  let data2 = JSON.parse(data);
  return data2;
}