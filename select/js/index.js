// 데이터 호출
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
      $("#temp").val("온도: " + temp + "℃");
      $("#hum").val("습도: " + hum + " %");
      $("#ph").val("산성도: " + ph + " pH");
      $("#led").val("밝기: " + led + " %");
      $("#slider").val(led/10);
      $("#lastvalue").html("현재 LED 밝기: " + led + " %");
      $("#er1").html("");
      $("#set").val("Y");
    },
    error: function () {
      console.log("error");
    },
  });
}


function callBack() {
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
      $("#temp").val("온도: " + temp + "℃");
      $("#hum").val("습도: " + hum + " %");
      $("#ph").val("산성도: " + ph + " pH");
      $("#lastvalue").html("현재 LED 밝기: " + led + " %");
      $("#er1").html("");
      $("#set").val("Y");
    },
    error: function () {
      console.log("error");
    },
  });
}

// 변경 데이터 저장
function dataTransmission() {
  const id = getCookie("userID");
  var per = (slider.value)*10;
  $.ajax({
    url: "php/data_submit.php",
    type: "POST",
    async: false,
    data: { 
      id: id,
      led: per
    },
    success: function (data) {
      if (data == "access") {
        console.log("can");
        $("#suc1").html("수정된 정보가 저장되었습니다.");
      }
      else {
        console.log(data);
        console.log(per);
      }
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