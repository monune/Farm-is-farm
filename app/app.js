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

  const img = $weather.find("._today .weather_graphic .weather_main i").attr('class');
  const textArray = img.split(" ");  // 공백 제거
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

  // console.log("온도: " + tempReplace);
  // --° --mm --% --풍 --m/s
  // console.log(Summary); 
  // 미세먼지, 초미세먼지, 자외선, 일몰
  // console.log("기타: " + weatherData);

  // 데이터 갱신
  let sql = `UPDATE iemh_team1.weather 
  SET temperature = ? ,
      filling_temperature = ?, 
      meteoric_water = ?, 
      humidity = ?, 
      wind_direction = ?, 
      wind_speed = ? ,
      fine_dust = ?,
      super_fine_dust = ?,
      ultraviolet_rays = ?,
      sunset = ?,
      class = ?
  `;
  
  const values = [tempReplace, Summary[0], Summary[1], Summary[2], Summary[3], Summary[4], weatherData[0], weatherData[1], weatherData[2], weatherData[3], imgClass[1]];

  connection.query(sql, values, (error, results) => {
    if (error) {
      console.log(error);
    } else {
      console.log(results);
    }
  });
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

setInterval(async () => {
  const data = await retrieveData();
  const address = data[0].address;
  parsing(`${address} 날씨`);
}, 3000);