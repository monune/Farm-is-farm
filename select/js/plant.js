// function 1 식물 효능 호출
// 각 식물을 데이터베이스에 저장하는 방식으로 변경하기
function Select(select_plant) {
  CallPlantInfo(select_plant);
  $(".btn-select").css("color", "black");
  $(".list-member").hide();
  // 기능 나열 /
  if (select_plant === "basil") {
    $(".btn-select").html("바질");
    document.getElementById("img").src = "icon/basil.png";
    $("#text").html(
      "• 채내 지방 분해로 장내 노폐물 배출.<br>" +
        "• 수족냉증과 같은 여성 질환 완화.<br>" +
        "• 각종 비타민과 식이섬유 함유.<br>" +
        "• 두통 완화.<br>"
    );
  } else if (select_plant === "lettuce") {
    $(".btn-select").html("버터헤드(상추)");
    document.getElementById("img").src = "icon/lettuce.png";
    $("#text").html(
      "• 풍부한 식이섬유 포함으로 소화를 촉진.<br>" +
        "• 다양한 영양소(비타민, 미네랄) 함유.<br>" +
        "• 빈혈, 저혈압과 같은 증상 예방.<br>" +
        "• 상추를 이용한 건강한 식단.<br>"
    );
  } else if (select_plant === "rosemary") {
    $(".btn-select").html("로즈마리");
    document.getElementById("img").src = "icon/rosemary.png";
    $("#text").html(
      "• 폴리페놀 등 다양한 성분의 면역력 강화.<br>" +
        "• 소화를 촉진시키고 장운동 증진.<br>" +
        "• 기억력 및 집중력 향상.<br>" +
        "• 공기 정화와 탈취 효과.<br>"
    );
  }
}

// function 1 식물 정보 호출
function CallPlantInfo(select_plant) {
  if (select_plant === "show") {
    $(".add-container").show();
  } else if (select_plant === "hide") {
    $(".add-container").hide();
  } else {
    $.ajax({
      url: "php/call_plantData.php",
      type: "POST",
      async: false,
      data: { select_plant: select_plant },
      success: function (data) {
        $("#temp").val("적정 온도: " + data.min_temp + "℃ ~ " + data.max_temp + "℃");
        $("#humi").val("적정 습도: " + data.min_hum + "% ~ " + data.max_hum + "%");
        $("#ph").val("적정 산성도: " + data.min_pH + "pH ~ " + data.max_pH + "pH");
        $("#light").val("빛 요구 사항: " + data.light + " 단계");
      },
      error: function () {
        console.log("error");
      },
    });
  }
}
