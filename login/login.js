function showPassword() {
    // look password
    const checkbox = document.getElementById('checkObject');
    const isChecked = checkbox.checked;
    const showsPW = document.getElementsByClassName("checkPassword");
    const showsBtn = document.getElementById("isOn");

    if (isChecked == true) {
        showsBtn.innerText = "끄기";
        showsPW[0].setAttribute("type", "text");
    }
    else { 
        showsBtn.innerText = '켜기';
        showsPW[0].setAttribute("type", "password");
    }
}
function LoginToMain() {
    var id = $("#login_id").val();
    var pw = $("#login_pw").val();
    $.ajax({
        url: "login_process.php",
        type: "post",
        datatype: "json",
        async: false,
        data: {
            id: id,
            pw: pw
        },
        success: function(response) {
            if (response == "access"){
                $("#login_res").html("");
                $("input[name=cnt]").val('possible');
            } else {
                if (response == "release") {
                    $("input[name=cnt]").val('impossible');
                }
                else {
                    $("#login_res").html("로그인 정보를 입력해주세요.");
                    $("input[name=cnt]").val('impossible');
                }
            }
        }
    });
}
function transPage() {
    var cnt = document.getElementsByName("cnt")[0].value;
    if (cnt !== "possible") {
        console.log("Error(login connecting): " + cnt);
        $("#login_res").html("로그인 정보가 올바르지 않습니다.");
        // 올바르지 않은 세션 제거
        clearTimeout(sessionTimeout);
        document.cookie = "sessionExpiration=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        return false;
    }
    else {
        console.log("login connecting: " + cnt + ", create Session");
        $("#login_res").html("");
        // 로그인 정보가 올바를 경우 올바른 세션 제공
        startSession();
        return true;
    }
} 

var sessionTimeout;
function startSession() {
    var sessionDuration = 3 * 24 * 60 * 60 * 1000; // 세션 유지 시간 3일 (밀리초 위)
  var currentTime = new Date().getTime();
  var sessionExpirationTime = currentTime + sessionDuration;
  var sessionExpirationUTCString = new Date(sessionExpirationTime).toUTCString();
  document.cookie = "sessionExpiration=" + sessionExpirationUTCString + "; path=/";
}