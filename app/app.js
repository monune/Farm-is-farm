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

const cheerio = require('cheerio');
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
  const $weather = $(".status_wrap");

  const temperature = $weather.find("._today .temperature_text strong:eq(0)").text();
  const summaryList = $weather.find(".summary_list .sort").text();
  const weatherData = [];

  const img = $weather.find("._today .weather_graphic .weather_main i").attr("class");
  const textArray = img.split(" "); // 공백 제거
  const imgClass = textArray[1].split("_"); // _ 제거

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

  // 습도 크롤링 / 나는 건들여서는 안되는걸 건들인게 아닐까? 이 문제가 나의 발목을 잡는다...
  
  const arr = [];
  const $dataItems = $("div.open .content_area .inner .forecast_wrap .hourly_forecast .humidity_graph_box div.scroll_box._horizontal_scroll._hourly_humidity .climate_box div.graph_wrap ul");
  for (let i = 0; i < 24; i++) {
    const today = $dataItems.find(`li.data .data_inner span.base_bar:eq(${i})`).attr('style');
    arr.push(today);
    if (today >= 10) {
    }
  }
  console.log(arr);
  


  // 날씨 데이터 갱신
  const weatherColumns = [
    'temperature', 'filling_temperature', 'meteoric_water', 'humidity',
    'wind_direction', 'wind_speed', 'fine_dust', 'super_fine_dust',
    'ultraviolet_rays', 'sunset', 'class'
  ];
  const weatherValues = [tempReplace, ...Summary.slice(0, 5), ...weatherData.slice(0, 4), imgClass[1]];
  updateDatabase('iemh_team1.weather', weatherColumns, weatherValues);
  
  // 습도 데이터 갱신
  const humiColumns = [
    'am12', 'am1', 'am2', 'am3', 'am4', 'am5', 'am6', 'am7', 'am8', 'am9', 'am10', 'am11',
    'pm12', 'pm1', 'pm2', 'pm3', 'pm4', 'pm5', 'pm6', 'pm7', 'pm8', 'pm9', 'pm10', 'pm11'
  ];
  // const humiValues = TimeArray.slice(0, 24);
  // updateDatabase('iemh_team1.live_humidity', humiColumns, humiValues);
};

// 데이터 조회
const retrieveData = () => {
  return new Promise((resolve, reject) => {
    let sql = `SELECT address FROM iemh_team1.weather`;
    connection.query(sql, (error, results) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

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

setInterval(async () => {
  const data = await retrieveData();
  const address = data[0].address;
  parsing(`${address} 날씨`);
}, 5000);