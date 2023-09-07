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

const using_url = "https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query="; // naver

const getHTML = async (keyword) => {
  try {
    return await axios.get(using_url + encodeURI(keyword));
  } catch (err) {
    console.log(err);
  }
};

// parsing 성공 
const parsing = async (serchKeyword) => {

  const html = await getHTML(serchKeyword);
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
  const soltArray = [];
  const $dataItems = $(".humidity_graph_box .climate_box ");
  for (let i = 0; i < 24 + (24 - today.getHours()); i++) {
    const tarr = $dataItems.find(`.time_wrap .time span.text:eq(${i})`).text();
    timeArray.push(tarr);
  }
  
  const puppeteerResult = await callPuppetter(serchKeyword, "li.data .num");
  console.log("---------------------------------------")
  console.log(soltArray); // 시간대 나열
  console.log(puppeteerResult); // 예상 습도 값

  const weatherValues = [tempReplace, ...Summary.slice(0, 5), ...weatherData.slice(0, 4), imgClass[1]];
  const weatherColumns = [ 
    'temperature', 'filling_temperature', 'meteoric_water', 'humidity',
    'wind_direction', 'wind_speed', 'fine_dust', 'super_fine_dust', 
    'ultraviolet_rays', 'sunset', 'class' 
  ];
  
  const humidityJsonData = JSON.stringify({ data: puppeteerResult });
  const soltJsonData = JSON.stringify({ data: soltArray });
  
  // update Database
  updateDatabase('iemh_team1.weather', weatherColumns, weatherValues);
  updateDatabase('iemh_team1.realtime_humidity', ['docs'], [humidityJsonData]);
  updateDatabase('iemh_team1.realtime_humidity', ['times'], [soltJsonData]);
};

setInterval(() => {
  parsing(`날씨`);
}, 10000);

/**
 * 데이터베이스 업데이트하는  함수
 * @param {database_table} table 
 * @param {Array} columns 
 * @param {value} values 업데이트할 데이터
 * @param {boolean} callback 
 */
 function updateDatabase(table, columns, values, callback) {
  const placeholders = columns.map(column => `${column} = ?`).join(', ');
  const sql = `UPDATE ${table} SET ${placeholders}`;
  connection.query(sql, values, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      // success messege
    }
    if (typeof callback === 'function') {
      callback(error, results);
    }
  });
}

/**
 * 원하는 정보를 검색하고 배열로 반환하는 함수입니다
 * @param {string} serchKeyword 검색할 키워드
 * @param {string} classKeyword 찾고싶은 클래스
 * @returns 
 */
const callPuppetter = async (serchKeyword, classKeyword) => {  
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto(using_url + encodeURI(serchKeyword));

  const PuppteerArray = await page.evaluate((classKeyword) => {
    const numElements = Array.from(document.querySelectorAll(classKeyword));
    const numbers = numElements.map(element => parseInt(element.textContent, 10));

    //처리
    const filteredNumbers = numbers.filter(number => number >= 10);
    const desiredLength = 24 + (24 - new Date().getHours());
    // 10 미만의 숫자를 0으로 채웁니다.
    while (filteredNumbers.length < desiredLength) filteredNumbers.push(0);
    // 배열의 길이가 원하는 길이보다 더 길다면 잘라냅니다.
    if (filteredNumbers.length > desiredLength) filteredNumbers.length = desiredLength;

    return filteredNumbers;
  }, classKeyword);

  return PuppteerArray;
};