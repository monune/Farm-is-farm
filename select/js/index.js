/**
 * 온도, 습도 값 가져오는 함수
 * @param {string} decide 새로고침 후 콘솔없이 활성화 'Y' or 'N'
 */
const callChart = (decide) => {
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
const callGraph = (decide) => {
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
  }
  });
}

const selectorsInfo = ["체감 온도", "강수량", "외부 습도", "풍향 | 풍속", "미세먼지", "초미세먼지", "자외선", "일몰 시간"];
const selectors = ['#w-ftp', '#w-wtr', '#w-hum', '#w-dir_spd', '#w-fd', '#w-sfd', '#w-uv', '#w-ss'];
const dataKeys = ['ftemp', 'mtr_water', 'hum', 'wind', 'fine', 'sp_fine', 'uvrays', 'sunset'];
/**
 * Node.js에서 받아온 날씨 정보 사용
 * @param {string} decide 새로고침 후 콘솔없이 활성화 'Y' or 'N'
 */
const callWeather = (decide) => {
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
        const selector = selectors[i] + "> div > span";
        if (selectors[i] == '#w-dir_spd') $(selector).html(selectorsInfo[i] + "<br>" + data.wind_dir + ", " + data.wind_spd); //데이터 동시 사용
        else if (isEmpty(data[dataKeys[i]])) {
          $(selectors[i] + "> div").css('width', '50');
          $(selector).css('display', 'none');
        } else {
          $(selector).html(selectorsInfo[i] + "<br>" +  data[dataKeys[i]]);
          setTimeout(() => {
            $(selectors[i] + "> div").css('width', '170');
            $(selector).css('display', 'block');
          }, 100);
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
const isEmpty = (value) => {
  if( value == "" || value == null || value == undefined || ( value != null && typeof value == "object" && !Object.keys(value).length ) ){
    return true
  }else{
    return false
  }
};

const loadWeather = () => {
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
const updateChart = (selectChart, newLabels, newData) => {
  if (!isEmpty(newData)) selectChart.data.datasets[0].data = newData;
  if (!isEmpty(newLabels)) selectChart.data.labels = newLabels;
  selectChart.update();
}

const searchPlantData = (plant) => {
  $.ajax({
    url: "php/get_plantInfo.php",
    type: "POST",
    async: false,
    data: {data: plant},
    success: function (data) {
      console.log(data);
    },
    error: function (err) {
      console.log("Err: " + err);
    },
  });
}
// 식물 데이터 호출

const callPlantInfomation = () => {
  const plant = document.getElementById('s-i').value;
  searchPlantData(plant);
}


/**
 * 쿠키 가져오는 함수
 * @param {string} cookieName 
 * @returns 
 */
const getCookie = (cookieName) => {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(cookieName + "=")) {
      return cookie.substring(cookieName.length + 1);
    }
  }
  return null;
}