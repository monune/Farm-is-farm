// 데이터 호출
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

// function 3 물 세기 표시 변경
function callWater() {
  const id = getCookie("userID");
  $.ajax({
    url: "php/call_waterData.php",
    type: "POST",
    async: false,
    data: { id: id },
    success: function (data) {
      // water grade
      if (data.water == 1) animationValue = "one";
      else if (data.water == 2) animationValue = "two";
      else if (data.water == 3) animationValue = "three";
      $("#w_value").html(data.water + " 단계");
      element.style.animation = animationValue + " 4s linear infinite";
      // slider value
      thumbLeft.style.left = data.min_hum + "%";
      range.style.left = data.min_hum + "%";
      thumbRight.style.right = 100 - data.max_hum + "%";
      range.style.right = 100 - data.max_hum + "%";
      inputLeft.value = data.min_hum;
      inputRight.value = data.max_hum;
    },
    error: function () {
      console.log("error");
    },
  });
}

// 초기 슬라이더 (하단) 값 설정
function setLeftValue() {
  var _this = inputLeft;
  var min = parseInt(_this.min);
  var max = parseInt(_this.max);
  _this.value = Math.min(parseInt(_this.value), parseInt(inputRight.value) - 1);
  var percent = ((_this.value - min) / (max - min)) * 100;
  thumbLeft.style.left = percent + "%";
  range.style.left = percent + "%";
} 

// 초기 슬라이더 (상단) 값 설정
function setRightValue() {
  var _this = inputRight;
  var min = parseInt(_this.min);
  var max = parseInt(_this.max);
  _this.value = Math.max(parseInt(_this.value), parseInt(inputLeft.value) + 1);
  var percent = ((_this.value - min) / (max - min)) * 100;
  thumbRight.style.right = 100 - percent + "%";
  range.style.right = 100 - percent + "%";
}

// 죄측 (하단) 슬라이더 증감
function incrementLeftSliderValue(increment) {
  var currentValue = parseInt(inputLeft.value);
  var newValue = currentValue + increment;
  var min = parseInt(inputLeft.min);
  var max = parseInt(inputLeft.max);
  newValue = Math.min(Math.max(newValue, min), parseInt(inputRight.value) - 1);
  var percent = ((newValue - min) / (max - min)) * 100;
  inputLeft.value = newValue;
  thumbLeft.style.left = percent + "%";
  range.style.left = percent + "%";
  console.log("left value: " + inputLeft.value); // 검사
  uploadSliderValue(); // 데이터 업데이트
  console.log("ok");
}

// 오른쪽 (상단) 슬라이더 증감
function incrementRightSliderValue(increment) {
  var currentValue = parseInt(inputRight.value);
  var newValue = currentValue + increment;
  var min = parseInt(inputRight.min);
  var max = parseInt(inputRight.max);
  newValue = Math.max(Math.min(newValue, max), parseInt(inputLeft.value) + 1);
  var percent = ((newValue - min) / (max - min)) * 100;
  inputRight.value = newValue;
  thumbRight.style.right = 100 - percent + "%";
  range.style.right = 100 - percent + "%";
  console.log("right value: " + inputRight.value); // 검사
  uploadSliderValue(); // 데이터 업데이트
  console.log("ok");
}

// 변경된 최소 습도와 최대 습도를 water 데이터베이스에 저장
function uploadSliderValue() {
  const id = getCookie("userID");
  $.ajax({
    url: "php/save_waterValue.php",
    type: "POST",
    async: false,
    data: {
      id: id,
      min: inputLeft.value,
      max: inputRight.value,
    },
    // 성공시 아무 동작 없음
    error: function () {
      console.log("error: 저장하지 못했습니다.");
    },
  });
}
