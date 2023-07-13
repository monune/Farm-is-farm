// 실시간 호출
function callBack() {
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
      $("#led").val("밝기: " + data.light + " 단계");
      $("#prg").val(data.light);
      const newData = [data.temp, data.hum, data.ph];
      updateChart(newData);
    },
    error: function () {
      console.log("error");
    },
  });
}

function updateChart(newData) {
    myChart.data.datasets[0].data = newData; // 새로운 데이터로 업데이트
    myChart.update(); // 차트 업데이트
}