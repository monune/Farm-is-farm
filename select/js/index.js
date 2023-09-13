/**
 * 온도, 습도 값 가져오는 함수
 * @param {string} decide 새로고침 후 콘솔없이 활성화 'Y' or 'N'
 */
let chartC = 1;
const chartLabels = ["온도(℃)", "습도(%)"];
const callChart = () => {
  const id = getCookie("userID");
  $.ajax({
    url: "php/call_HWdata.php",
    type: "POST",
    async: false,
    data: {  id: id },
    success: function (data) {
      if (chartC % 30 == 0) {
        console.log(data);
        chartC += 1;
      } else  chartC += 1;
      const newData = [data.temp, data.hum];
      try {
        updateChart(myChart, chartLabels, newData);
      } catch (err) {
        console.log("UpdateError: " + err);
      }
    },
    error: function (err) {
      console.log("AJAX Error: " + err);
    }
  });
}

/**
 * DB에 저장된 예상 습도를 그래프에 전달
 * @param {string} decide 새로고침 후 콘솔없이 활성화 'Y' or 'N'
 */
let graphC = 1;
const callGraph = () => {
  $.ajax({
  url: "php/call_nodeSystem.php",
  type: "POST",
  async: false,
  data: { data: "graph" },
  success: function (data) {
    const responseTimes = JSON.parse(data.times);
    const responseDocs = JSON.parse(data.docs);
    if(graphC % 30 == 0) {
      console.log(responseTimes.data);
      console.log(responseDocs.data);
      graphC += 1;
    } else graphC += 1;
    try {
      updateChart(myGraph, responseTimes.data, responseDocs.data);
    } catch(err) {
      console.log("UpdateError: " + err);
    }
  },
  error: function (err) {
    console.log("AJAX Error: " + err);
  }
  });
}

const selectorsInfo = ["체감 온도", "강수량", "외부 습도", "풍향 & 풍속", "미세먼지", "초미세먼지", "자외선", "일몰 시간"];
const selectors = ['#w-ftp', '#w-wtr', '#w-hum', '#w-dir_spd', '#w-fd', '#w-sfd', '#w-uv', '#w-ss'];
const dataKeys = ['ftemp', 'mtr_water', 'hum', 'wind', 'fine', 'sp_fine', 'uvrays', 'sunset'];
const selectorsID = ["", "체감 온도", "온도" ,"강수량", "외부 습도", "풍향", "풍속", "미세먼지", "초미세먼지", "자외선", "일몰 시간"];
/**
 * Node.js에서 받아온 날씨 정보 사용
 * @param {string} decide 새로고침 후 콘솔없이 활성화 'Y' or 'N'
 */
let oldArray = [];
const callWeather = () => {
  $.ajax({
    url: "php/call_nodeSystem.php",
    type: "POST",
    async: false,
    data: { data: "weather" },
    success: function (data) {     
      $("#w-tp").html(data.temp);
      $('#img_w').attr("src", "svg/icon_flat_" + data.class + ".svg"); 
      
      const weatherJsonObject = data;
      const newArray = Object.values(weatherJsonObject);

      if (!isEmpty(oldArray)) {
        for (let i=1; i <= newArray.length-1; i++) {
          if (oldArray[i] != newArray[i]) {
            const changedValue = [selectorsID[i], oldArray[i], newArray[i]];
            printCalendar('change', changedValue);
          }
        }
      }

      const canOnlyOnce = once(function() {
        oldArray = newArray;
      });
      canOnlyOnce();

      try {
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
      } catch (err) {
        console.log("Weather Data Error: " + err);
	    }
    },
    error: function (err) {
      console.log("AJAX Error: " + err);
    }
  });
}

let calendarCount = 0;
/**
 * 캘린더를 추가하고 order에 따라 함수를 실행한다
 * @param {string} order - 'data' || 'change'
 * @param {Array} valueArray - new Data Name | changed Data | new Data 
 */
const printCalendar = (order, valueArray) => {
  const newLi = $('<li><p class="calendar_' + calendarCount +'"></p></li>');
  $('#w-ul').append(newLi);
  if (calendarCount == 30) {
    for (let i=1; i <= 30; i++) {
      $("p.calendar_" + i).remove();
    }
    calendarCount = 0;
  }
  else {
    if (order === 'date') loadDate(calendarCount);
    else if (order === 'change') compareData(calendarCount, valueArray);
    calendarCount += 1;
  }
}

let today = new Date();
const todayArr = ['일', '월', '화', '수', '목', '금', '토'];
/**
 * 캘린더에 날씨를 출력하는 코드
 * @param {int} value 수정할 캘린더 번호
 */
const loadDate = (value) => {
  $(".calendar_" + value).html("- " + today.getFullYear() + "년 " + (today.getMonth() + 1) + "월 " + today.getDate() +"일 " + todayArr[today.getDay()] + "요일 입니다.");
}

/**
 * 데이터를 넣으면 값이 다름을 알려줌과 동시에 변경
 * @param {string} value count
 * @param {array} valueArray - new Data Name | changed Data | new Data
 */
const compareData = (value, valueArray) => {
  $(".calendar_" + value).html(sysTime() + valueArray[0] + "값이 " + valueArray[1] + "에서 " + valueArray[2] + "로 변경되었습니다.");
}
const sysTime = () => {
  return  "[" + today.getFullYear()%100 + "." + today.getUTCMonth() + 1 + "." + today.getDate() + "] "
}

/**
 * null 체크하는 함수
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
      console.log("AJAX Error: " + err);
    }
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

function once(fn, context) { 
  let result;
  return function() { 
      if (fn) {
          result = fn.apply(context || this, arguments);
          fn = null;
      }
      return result;
  };
}