// Out focus user name
function outFocus() {
    const n1 = document.getElementById('user_nm').value;
    if (n1.length < 3) {
        $("#nm_res").css("display","block");
        $("input[name=checked_nm]").val('N');
    } else {
        $("#nm_res").css("display","none")
        $("input[name=checked_nm]").val('Y');
    }
}

// Compare ID
function checkID() {
    var id = $("#user_id").val();
    if (id.length == 0) {
        $("#i_res").html("*아이디를 입력해주세요.");
        $("#i_res").css('color', 'red');
        $("input[name=checked_id]").val('N');
    } else if (id.length < 6) {
        $("#i_res").html("*아이디는 최소 6글자 이상, 16글자 미만입니다.");
        $("#i_res").css('color', 'red');
        $("input[name=checked_id]").val('N');
    } else {
        // jquery
        $.ajax({
            url: "sign_process.php",
            type: "POST",
            data: {
                user_id: id
            },
            success: function(response) {
                if(response == "exist") {
                    $("#i_res").html("*이미 존재하는 아이디입니다.");
                    $("#i_res").css('color', 'red');
                    $("input[name=checked_id]").val('N');
                } 
                else if (response == "not_exist"){
                    $("#i_res").html("사용 가능한 아이디입니다.");
                    $("#i_res").css('color', 'green');
                    $("input[name=checked_id]").val('Y'); // check ID
                }
            },
                    
            error : function (jqXHR, textStatus, errorThrown){
                console.log(jqXHR);  //응답 메시지
                console.log(textStatus); //"error"로 고정인듯함
                console.log(errorThrown);
            }
        });
    }
}

// Compare & Check Password
function checkPassword() {
    var p1 = document.getElementById('pw1').value;
    var p2 = document.getElementById('pw2').value;
    // compare Password
    if( p1 !== p2 ) {
        $("#pw_res").html("*비밀번호를 일치시켜주세요.");
        $("#pw_res").css('color', 'red');
        $("input[name=checked_pw]").val('N');
    } else {
        if (p1.length < 8) {
            $("#pw_res").html("*비밀번호가 너무 짧습니다. 최소 8글자 이상, 16글자 미만으로 작성해주세요.");
            $("#pw_res").css('color', 'red');
            $("input[name=checked_pw]").val('N');
        }
        else { // p1 == p2
            $("#pw_res").css("display", "none");
            // $("#pw_res").html("*비밀번호가 일치합니다.");
            // $("#pw_res").css('color', 'green');
            $("input[name=checked_pw]").val('Y'); // check Password
        }
    }
}

//check Nm, Id, Pw
function checkAccount() {
    var p1 = document.getElementById('pw1').value;
    var p2 = document.getElementById('pw2').value;
    var checked_id = document.getElementsByName('checked_id')[0].value;
    var checked_pw = document.getElementsByName('checked_pw')[0].value;
    var checked_nm = document.getElementsByName('checked_nm')[0].value;

    //check Name
    if (checked_nm !== "Y") {
        $("#nm_res").html("*사용자 이름은 최소 3글자 이상, 5글자 미만입니다.");
        $("#nm_res").css('color', 'red');
        return false;
    }
    //check ID
    if (checked_id !== "Y") {
        $("#i_res").html("*아이디 중복 검사를 해주세요.");
        $("#i_res").css('color', 'red');
        return false;
    }
    //check PW
    if (checked_pw !== "Y") {
        if (p1 !== p2) {
            $("#pw_res").html("*비밀번호를 일치시켜주세요.");
            $("#pw_res").css('color', 'red');
        } else if (p1.length < 8 || p2.length < 8) {
            $("#pw_res").html("*비밀번호가 너무 짧습니다. 최소 8글자 이상, 16글자 미만으로 작성해주세요.");
            $("#pw_res").css('color', 'red');
        }
        return false;
    } 
    else {
        return true;
    }
}

