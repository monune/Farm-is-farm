/**
 * 온도, 습도 값 가져오는 함수
 * @param {string} decide 새로고침 후 콘솔없이 활성화 'Y' or 'N'
 */
function callChart(decide) {
  const id = getCookie("userID");
  $.ajax({
    url: "php/call_HWdata.php",
    type: "POST",
    async: false,
    data: {  id: id },
    success: function (data) {
      if (decide === 'Y') console.log(data);
      $("#c-temp").val("Temperature: " + data.temp + " ℃");
      $("#c-hum").val("Humidity: " + data.hum + " %");
      
      const newData = [data.temp, data.hum];
      updateChart(myChart, newData);
    },
    error: function () {
      console.log("error");
    },
  });
}

/**
 * DB에 저장된 예상 습도를 그래프에 전달
 * @param {string} decide 새로고침 후 콘솔없이 활성화 'Y' or 'N'
 */
function callGraph(decide) {
  $.ajax({
  url: "php/call_nodeSystem.php",
  type: "POST",
  async: false,
  data: { data: "graph" },
  success: function (data) {
    const responseTimes = JSON.parse(data.times);
    const responseDocs = JSON.parse(data.docs);
    if(decide === 'Y') {
      console.log(responseTimes.data);
      console.log(responseDocs.data);
    }
    updateChart(myGraph, responseTimes.data, responseDocs.data);
  },
  error: function (err) {
    console.log("Err: " + err);
  },
});
}

const selectors = ['#w-ftp', '#w-wtr', '#w-hum', '#w-dir_spd', '#w-fd', '#w-sfd', '#w-uv', '#-ss'];
const dataKeys = ['ftemp', 'mtr_water', 'hum', 'wind', 'fine', 'sp_fine', 'uvrays', 'sunset'];
/**
 * Node.js에서 받아온 날씨 정보 사용
 * @param {string} decide 새로고침 후 콘솔없이 활성화 'Y' or 'N'
 */
function callWeather(decide) {
  $.ajax({
  url: "php/call_nodeSystem.php",
  type: "POST",
  async: false,
  data: { data: "weather" },
  success: function (data) {
    if(decide === 'Y') console.log(data);
    $("#w-tp").html(data.temp);
    $('#img_w').attr("src", "svg/icon_flat_" + data.class + ".svg"); 

    for (let i = 0; i < selectors.length; i++) {
      if (selectors[i] == '#w-dir_spd') $(selectors[i]).val(data.wind_dir + " " + data.wind_spd);
      else if (isEmpty(data[dataKeys[i]])) {
        $(selectors[i]).css('display', 'none');
      } else {
        $(selectors[i]).val(data[dataKeys[i]]);
        $(selectors[i]).css('display', 'block');
      }
    }
  },
  error: function (err) {
    console.log("Err: " + err);
  },
});
}

/**
 * @param {*} value 빈값 체크 
 * @returns 
 */
var isEmpty = function(value){
  if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){
    return true
  }else{
    return false
  }
};

function loadWeather() {
  let today = new Date();
  let todayArr = ['일', '월', '화', '수', '목', '금', '토'];
  $(".calendar").html(today.getFullYear() + "년 " + (today.getMonth() + 1) + "월 " + today.getDate() +"일 " + todayArr[today.getDay()] + "요일 입니다.");
}

/**
* Chart.js 업데이트 해주는 함수
* @param {string} selectChart 변경할 차트 선택
* @param {array} newData 변경할 데이터 배열
* @param {array} newLabels 변경할 레이블 배열
*/
function updateChart(selectChart, newLabels, newData) {
  if (!isEmpty(newData)) selectChart.data.datasets[0].data = newData;
  if (!isEmpty(newLabels)) selectChart.data.labels = newLabels;
  selectChart.update();
}

/**
 * 쿠키 가져오는 함수
 * @param {string} cookieName 
 * @returns 
 */
function getCookie(cookieName) {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(cookieName + "=")) {
      return cookie.substring(cookieName.length + 1);
    }
  }
  return null;
}