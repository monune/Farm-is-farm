/**
 * - 페이지 로드 >> 쿠키 검색 >> DB에서 temp, humi, ph, led 호출
 * >> n값에 호출한 값 출력 (로드 완료)
 *
 * - 적용 >> DB에 temp, humi, ph, led 저장 및 호출
 * >> n값에 호출한 값 출력 (리로드) >> 동작 종료
 */

function callData() {
  const id = getCookie("userID");
  $.ajax({
    url: "php/data_process.php",
    type: "POST",
    async: false,
    data: { id: id },
    success: function (data) {
      var temp = data.temp;
      var hum = data.hum;
      var ph = data.ph;
      var led = data.light;
      var value = (led%100)/10;

      $("#temp").val("온도: " + temp + "℃");
      $("#hum").val("습도: " + hum + " %");
      $("#ph").val("산성도: " + ph + " pH");
      $("#led").val("밝기: " + led + " %");
      $("#slider").val(value);
      $("#lastvalue").html("현재 LED 밝기: " + value*10 + " %");
      $("#er1").html("");
      $("#set").val("Y");
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

function dataTransmission() {
  
}