var led = 18; // 평균 온도
var lastled = led;

window.onload = function() {
    $("#led").val("LED 밝기: " + led + "%");
    $("#lastvalue").html("현재 LED 밝기: " + lastled + "%");
}

function ledUp() {
    led = led + 1;
    $("#led").val("LED 밝기: " + led + "%");
    if ((led - lastled) >= 5) {
        $("#er1").html("주의: 급격한 밝기 변화는 식물의 성장에 영향을 미칩니다.");
    } else {
        $("#er1").html("");
    }
}

function ledDown() {
    led = led - 1;
    $("#led").val("LED 밝기: " + led + "%");
    if ((lastled - led) >= 5) {
        $("#er1").html("주의: 급격한 밝기 변화는 식물의 성장에 영향을 미칩니다.");
    } else {
        $("#er1").html("");
    }
}