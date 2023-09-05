const cheerio = require('cheerio');
const axios = require('axios');

const getHTML = async (keyword) => {
  try {
    return await axios.get("https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=" + encodeURI(keyword));
  } catch (err) {
    console.log(err);
  }
};

const parsing = async (keyword) => {
  const html = await getHTML(keyword);
  const $ = cheerio.load(html.data);
  const $weather = $(".status_wrap");

  const temperature = $weather.find("._today .temperature_text strong:eq(0)").text();
  const summaryList = $weather.find(".summary_list .sort").text();
  const weatherData = [];

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

  console.log("온도: " + tempReplace);
  // --° --mm --% --풍 --m/s
  console.log(Summary);
  console.log("기타: " + weatherData); // 미세먼지, 초미세먼지, 자외선, 일몰
};

parsing("미추홀구 날씨");
