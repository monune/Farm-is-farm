let count = 1; // 1: on, else: off
let click = 0; // 1: on, else: off
var thisID = "";

// 사이드 슬라이더 동작
$(function () {
  $("#left-li-0").click(function () {
    if (count == 0) { // 축소
      $(".link_name").css({ color: "transparent" });
      $("#left_container").css({ "transition-duration": "0.8s", width: "80px", });
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
        if (thisID === "control") {
          Interval = setInterval(() => { 
            callChart(); 
            callGraph();
          }, 10000);
        }
        else if (thisID === "weather") Interval = setInterval(() => { callWeather(); }, 10000);
        else if (thisID === "light") {
          Interval = setInterval(() => {
            callTime();
          }, 10000);
        }
        $(".contFrame").addClass("remove");
        setTimeout(() => {
          $(".contFrame#" + thisID).addClass("move");
          $(".shorts").addClass("remove");
          setTimeout(() => {
            $(".contFrame#" + thisID).removeClass("remove");
            $(".longs").removeClass("remove");
          }, 500);
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

  $("#left-li-1").mouseover(function () {
    $("#t-user").css("display", "block");
  });
  $("#left-li-1").mouseout(function () {
    $("#t-user").css("display", "none");
  });

  $("#left-li-2").mouseover(function () {
    $("#t-project").css("display", "block");
  });
  $("#left-li-2").mouseout(function () {
    $("#t-project").css("display", "none");
  });

  $(".s-comment-box-1").html("현재 작동 중인 농장의 상태를<br> 확인할 수 있습니다.");
  $(".s-comment-box-2").html("실시간으로 환경 정보를 확인할 수 있습니다.");
  $(".s-comment-box-3").html("LED의 ON/OFF 시간을 제어할 수 있습니다.");
});

const myChart = new Chart(document.getElementById("myChart"), {
  type: "bar",
  data: {
    labels: ["온도(℃)", "습도(%)"],
    datasets: [
      {
        data: [10, 50],
        backgroundColor: ["rgba(255, 46, 133, 0.6)", "rgba(54, 162, 235, 0.6)"],
        borderColor: ["rgb(210, 60, 93)", "rgb(23, 100, 215)"],
        borderWidth: 4,
        barThickness: 70,
      },
    ],
  },
  options: {
    // indexAxis: 'y', // 수평 그래프
    plugins: {
      legend: { display: false, },
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
        ticks: {
          precision: 0, // 소수점 자릿수
          stepSize: 1, // 간격
          font: { size: 17 }  
        }
      },
      x: {
        ticks: {
          font: { size: 17}
        },
        grace: '10%'
      }
    },
    interaction: {
      intersect: false
    }
  },
});

const myGraph = new Chart(document.getElementById('myGraph'), {
    type: 'line',
    data: data = {
        labels: ["null_A", "null_B", "null_C"],
        datasets: [{
            label: " 예상 습도 변화량 (%)",
            fill: true,
            lineTension: 0.2,
            backgroundColor: "rgb(0, 132, 255, 0.6)",
            borderColor: "rgb(23, 100, 215, 0.8)",
            borderWidth: 5,
            data: [40, 10, 20],
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
                grace: '25%',
                ticks: {
                  font: {
                    size: 15
                  }
                }
            }, 
            x: {
              ticks: {
                font: {
                  size: 17
                }
              }
            }
        },
        interaction: {
          intersect: false
        }
    }
});

let colonCount = 0;
const countColon = () => {
  $(".colon > span").css("color", colonCount === 0 ? "black" : "white");
  colonCount = 1 - colonCount;
};

const addWave = () => {
  const newLi = $('<div class="wave"></div>');
  $('#c-data-left').append(newLi);
}

const goGit = () => {
  window.open('https://github.com/monune/farm-is-farm');
}