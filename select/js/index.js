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
    data: {
      id: id,
      data: "hardware"
    },
    success: function (data) {
      if (chartC % 30 == 0) {
        console.log(data);
        chartC += 1;
      } else  chartC += 1;
      $("#c-data-left").append("<span class='abs c-water-grade'>물의 세기<br>" + data.water + "단계</span>");
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

// 다른일 하는 친구
const selectorsID = ["", "체감 온도", "온도" ,"강수량", "외부 습도", "풍향", "풍속", "미세먼지", "초미세먼지", "자외선", "일몰 시간", "이미지 정보"];

// 국밥
const selectorsInfo = ["체감 온도", "강수량", "외부 습도", "풍향", "풍속", "미세먼지", "초미세먼지", "자외선", "일몰 시간"];
const selectors = ['#w-ftp', '#w-wtr', '#w-hum', '#w-dir', '#w-spd', '#w-fd', '#w-sfd', '#w-uv', '#w-ss'];
const dataKeys = ['ftemp', 'mtr_water', 'hum', 'wind_dir', 'wind_spd', 'fine', 'sp_fine', 'uvrays', 'sunset'];
/**
 * Node.js에서 받아온 날씨 정보 사용
 * @param {string} decide 새로고침 후 콘솔없이 활성화 'Y' or 'N'
 */
let trigger = true;
let lastArray = [];
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
      const nextArray = Object.values(weatherJsonObject);

      if (!isEmpty(lastArray)) {
        for (let i=1; i <= nextArray.length-1; i++) {
          if (lastArray[i] != nextArray[i]) {
            const changedValue = [selectorsID[i], lastArray[i], nextArray[i]];
            printConsole('change', changedValue);
            lastArray[i] = nextArray[i];
          }
        }
      }
      
      if (trigger) {
        printConsole('date');
        lastArray = nextArray;
        trigger = false;
      }

      try {
        for (let i = 0; i < selectors.length; i++) {
          const selector = selectors[i] + "> span";
          const dataValues = '<span class="w-text2">' + selectorsInfo[i] + '</span>';
          if (isEmpty(data[dataKeys[i]]) == false) {
            $(selector).html(dataValues + "<br>" +  data[dataKeys[i]]);
          } else {
            $(selector).html(dataValues + "<br>" +  "- -");
          }
        }
      } catch (err) {
        console.log("Weather Data Error: " + err);
	    }

      // 날씨 정보 출력
      if (data.fine || sp_fine === "좋음") {

      } else if (data.fine || sp_fine === "보통") {

      } else {
        
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
const printConsole = (order, valueArray) => {
  addNewLine();
  if (calendarCount >= 100) {
    for (let i=1; i <= 100; i++) {
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

// 캘린더 콘솔 지우는 코드
const clearConsole = () => {
  calendarCount = 0;
  for (let i=0; i<=100; i++) {
    $("p.calendar_" + i).remove();
  }
  // log 기록 추가
}

const addNewLine = () => {
  const newLi = $('<li><p class="calendar_' + calendarCount +'"></p></li>');
  $('#w-console').append(newLi);
}

let today = new Date();
const todayArr = ['일', '월', '화', '수', '목', '금', '토'];
/**
 * 캘린더에 날씨를 출력하는 코드
 * @param {int} value 수정할 캘린더 번호
 */
const loadDate = (value) => {
  $(".calendar_" + value).html(sysTime() + today.getFullYear() + "년 " + (today.getMonth() + 1) + "월 " + today.getDate() +"일 " + todayArr[today.getDay()] + "요일 입니다.");
}

/**
 * 데이터를 넣으면 값이 다름을 알려줌과 동시에 변경
 * @param {string} value count
 * @param {array} valueArray - new Data Name | changed Data | new Data
 */
const compareData = (value, valueArray) => {
  $(".calendar_" + value).html(sysTime() + valueArray[0] + "이(가) " + valueArray[1] + "에서 " + valueArray[2] + "로 변경되었습니다.");
}
const sysTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `[${hours}:${minutes}:${seconds}] `;
}

/**
 * input#w-command에 입력된 값을 실행하는 코드
 */
const goCommand = () => {
  let userInput = document.getElementById('w-command').value;
  if (isEmpty(userInput)) {
    console.log("값이 존재하지 않습니다.");
  } else {
      try {
        var dynamicFunction = new Function('return ' + userInput);
        var result = dynamicFunction();
        console.log(result);
        document.getElementById('w-command').value = '';
        addNewLine();
        $(".calendar_" + calendarCount).html(sysTime() + userInput + " 을 성공적으로 실행했습니다. ");
        calendarCount += 1;
      } catch (err) {
        console.log("Error: " + err);
      }
  }
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

const callTime = () => {
  const id = getCookie("userID");
  $.ajax({
    url: "php/call_HWdata.php",
    type: "POST",
    async: false,
    data: {
      id: id,
      data: "hardware",
    },
    success: function (data) {
      const jsonObject = JSON.parse(data.time);
      const array = [jsonObject.start, jsonObject.end];
      // 시, 분, 시, 분으로 변환
      const organizedArray = array.reduce((result, item) => { // [11, 22, 33, 44]
        const segments = item.split(':');
        result.push(...segments);
        return result;
      }, []);
      
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 2; j++) {
          $(`#panels_${i * 2 + j + 1}`).val(organizedArray[i][j]);
        }
      }

      // 현재 시간
      const td = new Date();
      const currentHours = td.getHours();
      const currentMinutes = td.getMinutes();
      
      // JS 배열 구조 분해를 사용한 값 저장
      const timeValues = [];
      for (let i = 0; i < organizedArray.length; i++) timeValues.push(parseInt(organizedArray[i]));
      const [startHours, startMinutes, endHours, endMinutes] = timeValues;

      // 시간 비교
      const isWithinRange =
        (currentHours > startHours || (currentHours === startHours && currentMinutes >= startMinutes)) &&
        (currentHours < endHours || (currentHours === endHours && currentMinutes <= endMinutes));
      
        // 비교 결과
      if (isWithinRange) {
        changeLightgrade(1);
      } else {
        changeLightgrade(0);
      }
    },
    error: function (err) {
      console.log("AJAX Error: " + err);
    }
  });
}

const changeLightgrade = (value) => {
  const id = getCookie("userID");
  $.ajax({
    url: "php/call_HWdata.php",
    type: "POST",
    async: false,
    data: {
      id: id,
      data: "light",
      value: value
    },
    success: function (data) {
      console.log(data);
    },
    error: function (err) {
      console.log("AJAX Error: " + err);
    }
  });
}