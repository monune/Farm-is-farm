let count = 1; // 1: on, else: off
let click = 0; // 1: on, else: off
var thisID = "";

// 사이드 슬라이더 동작
$(document).ready(function () {
  $("#manu").click(function () {
    if (count == 0) { // 축소
      $(".link_name").css({ color: "transparent" });
      $("#left_container").css({ "transition-duration": "0.8s", width: "77px", });
      setTimeout(() => { $("#left_container").css("transition-duration", "0s"); }, 100);
      count = 1;
    } else { // 확장
      $(".link_name").css({ color: "black", display: "block" });
      $("#left_container").css({ "transition-duration": "0.8s", width: "230px", });
      setTimeout(() => { $("#left_container").css("transition-duration", "0s"); }, 100);
      count = 0;
    }
  });

  let Interval;
  let arrow_clickCount = 0;
  // 선택자 확장
  $(".contFrame").click(function (event) {
    if (click == 0) {
      thisID = this.id;
      if ( event.target.id == thisID || event.target.id === "cont-h" || event.target.className === "shorts" ) {
        console.log(thisID + " Interval start");
        if (thisID == "control") Interval = setInterval(() => { callChart("Y"); callGraph("Y");}, 3000);
        else if (thisID == "weather") Interval = setInterval(() => { callWeather("Y"); }, 3000);
        $(".contFrame").addClass("remove"); // 전체 OFF
        setTimeout(() => {
          $(".contFrame#" + thisID).addClass("move");
          $(".shorts").addClass("remove");
          setTimeout(() => {
            $(".contFrame#" + thisID).removeClass("remove");
            $(".longs").removeClass("remove");
          }, 500); // remove하면서 부드러운 출력
        }, 800);
        click = 1;
        arrow_clickCount = 0;
      }
    } else {
      $("body").on("click", ".bx-arrow-back", function () {
        if (arrow_clickCount === 0) {
          console.log(thisID + " Interval finished..");
          arrow_clickCount = 1;
          click = 0;
          clearInterval(Interval);
        }
      });
    }
  });

  // 선택자 축소
  $("i.bx-arrow-back").click(function () {
    $(".contFrame").addClass("remove");
    $(".longs").addClass("remove");
    setTimeout(() => { $(".contFrame").removeClass("move"); }, 500);
    setTimeout(() => {
      $(".contFrame").removeClass("remove");
      $(".shorts").removeClass("remove");
    }, 1000);
  });
});

const myChart = new Chart(document.getElementById("myChart"), {
  type: "bar",
  data: {
    labels: ["온도(℃)", "습도(%)"],
    datasets: [
      {
        data: [10, 50],
        backgroundColor: ["rgba(255, 99, 132, 0.8)", "rgba(54, 162, 235, 0.8)"],
        borderColor: ["rgb(255, 60, 102)", "rgb(23, 100, 215)"],
        borderWidth: 2,
        barThickness: 80,
      },
    ],
  },
  options: {
    plugins: {
      legend: { display: false, },
      tooltip: { enabled: false, },
    },
    responsive: false,
    scales: {
      y: {
        beginAtZero: true,
        grace: '10%',
        ticks: {
          precision: 0, // 소수점 자릿수
          stepSize: 1, // 간격
        },
      },
    },
  },
});

const myGraph = new Chart(document.getElementById('myGraph'), {
    type: 'line',
    data: data = {
        labels: ["A", "B", "C"],
        datasets: [{
            label: " 예상 습도 변화량 (%)",
            fill: true,
            lineTension: 0.4, // 지랄 정도
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 4,
            data: [5, 10, 15, 5, 20, 25, 15, 30, 35, 25],
        }]
    },
    options: {
        plugins: {
          legend: {
            display: false,
            align: 'start',
            labels: {
              font: { size: 20},
              boxWidth: 25,
              boxHeight: 15,
            },
            position: 'bottom'
          },
          tooltip: {
            padding: 10,
            titleFont: { size: 20 },
            bodyFont: { size: 15 }
          }
        },
        responsive: false,
        scales: {
            y: {
                beginAtZero: true,
                grace: '5%'
            }
        },
        interaction: {
          intersect: false
        }
    }
});