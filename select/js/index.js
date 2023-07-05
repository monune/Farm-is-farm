// 데이터 호출
function callData() {
  const id = getCookie("userID");
  $.ajax({
    url: "php/data_process.php",
    type: "POST",
    async: false,
    data: { id: id },
    success: function (data) {
      $("#temp").val("온도: " + data.temp + "℃");
      $("#hum").val("습도: " + data.hum + " %");
      $("#ph").val("수소 이온: " + data.ph + " pH");
      $("#led").val("빛의 밝기: " + data.light + " 단계"); // 1 ~ 3
      $("#led_grade").val(data.light);
    },
    error: function () {
      console.log("error");
    },
  });
}

// 실시간 호출
function callBack() {
  const id = getCookie("userID");
  $.ajax({
    url: "php/data_process.php",
    type: "POST",
    async: false,
    data: { id: id },
    success: function (data) {
      $("#temp").val("온도: " + data.temp + "℃");
      $("#hum").val("습도: " + data.hum + " %");
      $("#ph").val("수소 이온: " + data.ph + " pH");
      $("#led").val("빛의 밝기: " + data.light + " 단계");
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

// 변경 데이터 저장
function dataTransmission() {
  const id = getCookie("userID");
  const led = led_grade.value;
  $.ajax({
    url: "php/data_submit.php",
    type: "POST",
    async: false,
    data: {
      id: id,
      // change value:
      led: led,
    },
    success: function (data) {
      if (data == "access") {
        console.log("Data transmission was successful.");
      } else {
        console.log("Data transfer failed. Error: " + data);
      }
    },
    error: function () {
      console.log("error");
    },
  });
}

// function 2 LED 밝기 단계 상승
function gradeUp() {
  if (led_grade.value === "1") {
    led_grade.value = "2";
  } else if (led_grade.value === "2") {
    led_grade.value = "3";
  } else if (led_grade.value === "3") {
    led_grade.value = led_grade.value;
    console.log("이미 3단계 입니다.");
  }
  dataTransmission();
}
// function 2 LED 밝기 단계 하강
function gradeDown() {
  if (led_grade.value === "3") {
    led_grade.value = "2";
  } else if (led_grade.value === "2") {
    led_grade.value = "1";
  } else if (led_grade.value === "1") {
    led_grade.value = led_grade.value;
    console.log("이미 1단계 입니다.");
  }
  dataTransmission();
}

// function 3 물 세기 호출
function callWater() {
  const id = getCookie("userID");
  $.ajax({
    url: "php/data_callWater.php",
    type: "POST",
    async: false,
    data: { id: id },
    success: function (data) {},
  });
}