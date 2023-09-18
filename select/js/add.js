
let time = ["00:00","00:00"]; // 결과 값
let timer = [0, 0, 0, 0, 0, 0, 0, 0];

$(function() {
    const panels = '.l-panels-box';
    const left = '.l-left-box';
    const right = '.l-right-box';
    const btn = '.l-btn-box';

    const arrID = ['ftp', 'wtr', 'hum', 'dir', 'spd', 'fd', 'sfd', 'uv', 'ss'];
    const arrName = ["체감 온도", "강수량", "외부 습도", "풍향", "풍속", "미세먼지", "초미세먼지", "자외선", "일몰 시간"];

    const addColon = (type) => {
        const colon = $('<div class="colon"><span>:<span><div>');
        if (type == 1) {
            $(panels + ">" + left).append(colon);
        } else {
            $(panels + ">" + right).append(colon);
        }
    }

    // panels in input
    for (let i=1; i<=8; i++) {
        const input = $('<input type="text" id="panels_' + i + '" class="l-panels" value="0">');
        if (i <= 4) {
            $(panels + ">" + left).append(input);
            if (i === 2) addColon(1);
        } else {
            $(panels + ">" + right).append(input);
            if (i === 6) addColon();
        }
    }

    for (let i = 1; i <= 8; i++) {
        const button = $('<button id="panel_' + i + '">▲</button>');
        if (i <= 4) {
            $(btn + ">" + left).append(button);
        } else {
            $(btn + ">" + right).append(button);
        }
    }

    // weather 
    for (let i=0; i<9; i++) {
        const arr = $(
            '<div class="w-data_inner" id="w-' + arrID[i] + '">' +
            '<span class="w-text">' + arrName[i] + '</span>' +
            '</div>'
        );
        $("#w-grid").append(arr);
    }
    

    // sidebar comment -- user
    const partuser = '<div class="t-partbar"> <div class="part-user">ID</div> <p>'+ getCookie("userID") +'</p> </div>'
    $("#t-user").append(partuser);

    // sidebar comment -- project
    const partName = ["하드웨어", "소프트웨어", "기구설계", "웹 개발"];
    const partMen = ["김성모, 김우중", "김성모, 김우중, 우현성", "김진안, 장민석", "우현성"];
    for (let i=1; i <= 4; i++) {
        const partbar = '<div class="t-partbar-'+i+'"> <div class="part-'+ i +'">'+ partName[i-1] +'</div> <p>'+ partMen[i-1] +'</p> </div>'
        $("#t-project").append(partbar);
    }

    // sidebar comment -- session
    const partsession = '<div class="t-partbar"> <div class="part-session">Session</div> <p>남은 로그인 시간 입니다.</p> </div>';;
    $("#t-session").append(partsession);

    const updateLightStart = () => {
        for (let i=1; i<5; i++) {
            $("#panels_" + i).val(timer[i-1]);
        }
        console.log("START: " + timer[0] +""+ timer[1] + ":" + timer[2] +""+ timer[3]);
        time[0] = timer[0] +""+ timer[1] + ":" + timer[2] +""+ timer[3];
    }
    const updateLightEnd = () => {
        for (let i=5; i<9; i++) {
            $("#panels_" + i).val(timer[i-1]);
        }
        console.log("END: " + timer[4] +""+ timer[5] + ":" + timer[6] +""+ timer[7]);
        time[1] = timer[4] +""+ timer[5] + ":" + timer[6] +""+ timer[7];
    }

    // hour tens
    $("#panel_1").on("click", function() {
        timer[0] = (timer[0] + 1) % 3;
        updateLightStart();
    });
    $("#panel_5").on("click", function() {
        timer[4] = (timer[4] + 1) % 3;
        updateLightEnd();
    });

    // hour ones
    $("#panel_2").on("click", function() {
        if (timer[0] === 2 && timer[1] === 3) { // 23
            timer[0] = 0;
            timer[1] = 0;
        } else {
            timer[1] = (timer[1] + 1) % 10;
            if (timer[1] === 0) {
                timer[0] = (timer[0] + 1) % 3;
            }
        }
        updateLightStart();
    });
    $("#panel_6").on("click", function() {
        if (timer[4] === 2 && timer[5] === 3) { // 23
            timer[4] = 0;
            timer[5] = 0;
        } else {
            timer[5] = (timer[5] + 1) % 10;
            if (timer[5] === 0) {
                timer[4] = (timer[4] + 1) % 3;
            }
        }
        updateLightEnd();
    });

    // min tens
    $("#panel_3").on("click", function() {
        timer[2] = (timer[2] + 1) % 6;
        updateLightStart();
    });
    $("#panel_7").on("click", function() {
        timer[6] = (timer[6] + 1) % 6;
        updateLightEnd();
    });

    // min ones
    $("#panel_4").on("click", function() {
        timer[3] = (timer[3] + 1) % 10;
        if (timer[3] === 0) {
            timer[2] = (timer[2] + 1) % 6;
        }
        updateLightStart();
    });
    $("#panel_8").on("click", function() {
        timer[7] = (timer[7] + 1) % 10;
        if (timer[7] === 0) {
            timer[6] = (timer[6] + 1) % 6;
        }
        updateLightEnd();
    });

    setTimeout(() => {
        for (let i=1; i<9; i++) {
            timer[i-1] = $("#panels_" + i).val();
        }
        time = [timer[0] +""+ timer[1] +":"+ timer[2] +""+ timer[3], timer[4] +""+ timer[5] +":"+ timer[6] +""+ timer[7]];
    }, 1000);
});

let lightConsoleCount = 0;
const updateLightTime = () => {
    const json = {
        start: time[0],
        end: time[1]
    };
    const timeJSON = JSON.stringify(json);
    const id = getCookie("userID");
    $.ajax({
        url: "php/call_HWdata.php",
        type: "POST",
        async: false,
        data: {
            id: id,
            data: "time",
            array: timeJSON
        },
        success: function (data) {
            console.log(time);
            console.log(timer);
            const newLi = $('<li><p class="console_' + lightConsoleCount +'"></p></li>');
            $('.l-console > ul').append(newLi);
            $(".console_" + lightConsoleCount).html(sysTime() + "LED 예약시간 변경에 성공했습니다. TIME: " + time[0] + " to " + time[1]);
            lightConsoleCount += 1;
            console.log(data);
        },
        error: function (err) {
            console.log("AJAX Error: " + err);
            const newLi = $('<li><p class="console_' + lightConsoleCount +'" style="color: red;"></p></li>');
            $('.l-console > ul').append(newLi);
            $(".console_" + lightConsoleCount).html(sysTime() + "Error: " + err);
            lightConsoleCount += 1;
        }
    });
}