// 데이터 호출 - 아직 쓸 일 없음
function callData() {
  const id = getCookie("userID");
  $.ajax({
    url: "php/call_HWdata.php",
    type: "POST",
    async: false,
    data: { id: id },
    success: function (data) {
      $("#temp").val("온도: " + data.temp + " ℃");
      $("#hum").val("습도: " + data.hum + " %");
      $("#ph").val("수내 산성도: " + data.ph + " pH");
      $("#led").val("밝기: " + data.light + " 단계"); // 1 ~ 3
      $("#led_grade").val(data.light);
    },
    error: function () {
      console.log("error");
    },
  });
}

// 쿠키 호출
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

/**
 * 온습도 센서 값 가져오는 함수
 * @param {*} decide 새로고침 후 콘솔없이 활성화 'Y' or 'N'
 */
function callChart(decide) {
  const id = getCookie("userID");
  $.ajax({
    url: "php/call_HWdata.php",
    type: "POST",
    async: false,
    data: { id: id },
    success: function (data) {
      if (decide === 'Y') console.log(data);
      $("#c-temp").val("Temperature: " + data.temp + " ℃");
      $("#c-hum").val("Humidity: " + data.hum + " %");

      $("#prg").val(data.light);
      const newData = [data.temp, data.hum];
      updateChart(myChart, newData);
    },
    error: function () {
      console.log("error");
    },
  });
}

const selectors = ['#w-ftp', '#w-wtr', '#w-hum', '#w-dir_spd', '#w-fd', '#w-sfd', '#w-uv', '#-ss'];
const dataKeys = ['ftemp', 'mtr_water', 'hum', 'wind', 'fine', 'sp_fine', 'uvrays', 'sunset'];

/**
 * Node.js에서 받아온 날씨 정보 사용
 * @param {string} decide console 출력 사용 여부
 */
function callWeather(decide) {
  $.ajax({
  url: "php/call_nodeWeather.php",
  type: "POST",
  async: false,
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

/**
* Chart.js 업데이트 해주는 함수
* @param {string} selectChart 변경할 차트 선택
* @param {array} newData 변경할 배열 정보
*/
function updateChart(selectChart, newData) {
   selectChart.data.datasets[0].data = newData;
   selectChart.update();
}