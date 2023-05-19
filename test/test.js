var sessionTimeout;
function startSession() {
  // var sessionDuration = 3 * 24 * 60 * 60 * 1000; // 세션 유지 시간 3일 (밀리초 위)
  var sessionDuration = 10 * 1000; // 세션 유지 시간 3초 (밀리초 단위)
  var currentTime = new Date().getTime();
  var sessionExpirationTime = currentTime + sessionDuration;
  var sessionExpirationUTCString = new Date(sessionExpirationTime).toUTCString();
  document.cookie = "sessionExpiration=" + sessionExpirationUTCString + "; path=/";
  alert("세션이 시작되었습니다.");

  // 세션 만료 시간이 경과하면 세션 만료 함수 호출
  sessionTimeout = setTimeout(sessionExpired, sessionDuration);
}

function checkSession() {
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.indexOf("sessionExpiration=") === 0) {
      var sessionExpirationUTCString = cookie.substring(
        "sessionExpiration=".length
      );
      var sessionExpirationTime = new Date(
        sessionExpirationUTCString
      ).getTime();
      var currentTime = new Date().getTime();

      if (currentTime < sessionExpirationTime) {
        var timeRemaining = sessionExpirationTime - currentTime;
        var seconds = Math.floor(timeRemaining / 1000);
        $("#A").html("세션이 유효합니다.\n남은 시간: " + seconds + "초");
      } else {
        $("#A").html("세션이 만료되었습니다.");
      }
      return;
    }
  }

  alert("세션이 없습니다.");
}

function sessionExpired() {
  alert("세션이 끝났습니다.");
  console.log("만료");
  clearSession(); // 세션 만료 시 쿠키 삭제
}
 
function checkCookie() {
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    if (cookie.indexOf("sessionExpiration=") === 0) {
      var sessionExpirationUTCString = cookie.substring(
        "sessionExpiration=".length
      );
      var sessionExpirationTime = new Date(
        sessionExpirationUTCString
      ).getTime();
      var currentTime = new Date().getTime();

      if (currentTime < sessionExpirationTime) {
        alert("세션이 쿠키에 저장되어 있습니다.");
        alert("세션 만료 시간: " + sessionExpirationUTCString);
      } else {
        alert("세션이 쿠키에 저장되어 있지 않습니다.");
      }
      return;
    }
  }

  alert("세션이 쿠키에 저장되어 있지 않습니다.");
}

function clearSession() {
  clearTimeout(sessionTimeout);
  document.cookie =
    "sessionExpiration=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    $("#A").html("세션이 삭제되었습니다.");
}
