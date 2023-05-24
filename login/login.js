/**
 * 비밀번호 부호화
 */
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

/**
 * 로그인 정보 검사
 */
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

/**
 * - return true: 세션 저장, 쿠키에 아이디 저장
 * - return false: 세션 제거, 페이지 이동 거부
 */
function transPage() {
    var cnt = document.getElementsByName("cnt")[0].value;
    var uid = document.getElementById("login_id").value;
    if (cnt !== "possible") {
        console.log("Error(login connecting): " + cnt);
        $("#login_res").html("로그인 정보가 올바르지 않습니다.");
        clearTimeout(sessionTimeout); // 세션 제거
        document.cookie = "sessionExpiration=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        return false;
    }
    else {
        console.log("login connecting: " + cnt + ", create Session");
        $("#login_res").html("");
        startSession(); // 세션 생성
        setCookie("userID", uid); // 쿠키 저장
        const id = getCookie('userID');
        console.log(id);
        return true;
    }
} 

// 쿠키에 저장
 function setCookie(name, value) {
    document.cookie = name + "=" + (value || "") + "; path=/";
}
// 쿠키 호출
function getCookie(cookieName) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(cookieName + '=')) {
            return cookie.substring(cookieName.length + 1);
        }
    }
    return null;
}

// 세션 시작
var sessionTimeout;
function startSession() {
    var sessionDuration = 3 * 24 * 60 * 60 * 1000; // 3일 (밀리초 위)
    var currentTime = new Date().getTime();
    var sessionExpirationTime = currentTime + sessionDuration;
    var sessionExpirationUTCString = new Date(sessionExpirationTime).toUTCString();
    document.cookie = "sessionExpiration=" + sessionExpirationUTCString + "; path=/";
}