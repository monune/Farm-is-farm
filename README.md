# 🙏 농장팜니다

농장FARM니다는 기존 스마트 팜의 설비를 재정비하고 원격 제어를 돕는 AJAX 기법 기반의 웹 서비스 입니다.


---

### 📈 HARDWARE PAGE

**HARDWARE**는 ATMEGA128를 통해 얻은 센서의 값을 실시간으로 불러들이는 페이지입니다.

라즈베리파이가 블루투스 통신으로 전달받은 데이터를 DB에 계속 넣어주면서 계속 새로운 정보를 받을 수 있습니다.

- 습도에 따라 변경하는 모터 값 확인 가능
- 실시간 온도, 습도 데이터 호출
- 모레까지의 예상 습도 데이터 호출


```javascript
const callWeather = () => {
if (!isEmpty(lastArray)) {
    for (let i=1; i <= nextArray.length-1; i++) {
        if (lastArray[i] != nextArray[i]) {
            const changedValue = [selectorsID[i], lastArray[i], nextArray[i]];
            printConsole('change', changedValue);
            lastArray[i] = nextArray[i];
        }
    }
}
  
if (trigger) {
    printConsole('date');
    lastArray = nextArray;
    trigger = false;
}

try {
    for (let i = 0; i < selectors.length; i++) {
        const selector = selectors[i] + "> span";
        const dataValues = '<span class="w-text2">' + selectorsInfo[i] + '</span>';
        if (isEmpty(data[dataKeys[i]]) == false) {
            $(selector).html(dataValues + "<br>" +  data[dataKeys[i]]);
        } else {
            $(selector).html(dataValues + "<br>" +  "- -");
        }
    }
} catch (err) {
    console.log("Weather Data Error: " + err);
}
}
```

대표적으로 **callWeather()** 함수는 변경된 데이터를 과거 데이터와 비교하고 변경점을 알려주는 함수입니다.

**AJAX** 기법으로 데이터를 주고받으며 동적인 웹페이지를 만들 수 있습니다.


___

### 💦 WEATHER PAGE

실시간 날씨 정보와 관련된 파트입니다. 주요 기능은 N개 입니다.

- 실시간 날씨 정보 확인
- 실시간 정보 기록

실시간 정보를 기록하기위해 설정한 시간마다 데이터베이스에서 정보를 호출합니다.

#### 🌈 weather function

```javascript
const callWeather = () => {
  $.ajax({
    url: "php/call_nodeSystem.php",
    type: "POST",
    async: false,
    data: { data: "weather" },
    success: function (data) {     
      $("#w-tp").html(data.temp);
      $('#img_w').attr("src", "svg/icon_flat_" + data.class + ".svg"); 
      
      const weatherJsonObject = data;
      const nextArray = Object.values(weatherJsonObject);

      if (!isEmpty(lastArray)) {
        for (let i=1; i <= nextArray.length-1; i++) {
          if (lastArray[i] != nextArray[i]) {
            const changedValue = [selectorsID[i], lastArray[i], nextArray[i]];
            printConsole('change', changedValue);
            lastArray[i] = nextArray[i];
          }
        }
      }
     ...
```

처음 호출에서만 lastArray에 데이터를 저장합니다.

이후 isEmpty() 함수로 null 값을 제거하고나면 웹사이트에 직접 데이터를 적용시킬 수 있습니다.

call_nodeSystem.php 로 보낸 분류데이터를 통해 사용할 데이터베이스를 정하고 weather DB에서 정보를 가져옵니다.


#### 📃 console function 

데이터를 좀더 쉽게 관리하기 위해 함수를 추가했습니다.

```javascript
addNewLine();
printConsole(select, array);
clearConsole();
```
- addNewLine()
	- 새로운 라인을 추가하는 함수입니다.
- printConsole()
	- addNewLine() 으로 추가한 라인에 데이터를 집어넣는 함수입니다.
- clearConsole()
	- 말 그대로 모든 콘솔 라인과 정보를 제거하는 함수입니다.

___

### 💡 LED CONTROL PAGE

가장 최근(!!)에 추가된 **LED CONTROL** (이하 LCON)은 타이머 기능으로 LED를 제어할 수 있습니다.

```javascript
const organizedArray = array.reduce((result, item) => { // [11, 22, 33, 44]
    const segments = item.split(':');
    result.push(...segments);
    return result;
  }, []);
  if (callSet === 1) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 2; j++) {
        $(`#panels_${i * 2 + j + 1}`).val(organizedArray[i][j]);
      }
    }
  }

  // 현재 시간
  const td = new Date();
  const currentHours = td.getHours();
  const currentMinutes = td.getMinutes();
  
  // JS 배열 구조 분해를 사용한 값 저장
  const timeValues = [];
  for (let i = 0; i < organizedArray.length; i++) timeValues.push(parseInt(organizedArray[i]));
  const [startHours, startMinutes, endHours, endMinutes] = timeValues;

  // 시간 비교
  const isWithinRange =
    (currentHours > startHours || (currentHours === startHours && currentMinutes >= startMinutes)) &&
    (currentHours < endHours || (currentHours === endHours && currentMinutes <= endMinutes));
```

isWithinRange 을 사용해 현재 LED의 상태를 정하고 DB에 저장해 하드웨어 서버(라즈베리파이 작동)에서 사용할 수 있습니다.

---
### ✅ Node.Js Back Server
* app.js
```javascript
parsing(serchKeyword);

callPuppteer(serchKeyword, classKeyword);

updateDatabase(table, columns, values, callback);

// 데이터 갱신 타이밍 선택 가능
setInterval(() => {
  parsing(`날씨`);
}, setInterval);
```

callPuppteer 함수와 updateDatabase 함수는 parsing 함수 내부에서 호출되는 함수들입니다. 

parsing 함수 중심의 비동기 함수를 사용했으며, 비동기 중첩 문제는 await / asnyc 로 완화시켰습니다.

모든 동작은 데이터베이스 중심의 정보교환이며 실시간 파트도 존재합니다.

아래는 페이지에 따른 기능 설명입니다.

#### 1. 🌊 parsing 

날씨를 스크래핑해 저장하는 함수입니다. parsing 으로 가져올 수 있는 데이터는 다음과 같습니다.

cheerio 노드 라이브러리를 사용해 데이터를 반환하고 반환된 데이터는 배열에 저장합니다.

* Temperature
* Filling temperature
* Precipitation ( meteoric_water )
* Humidity
* Wind direction
* Wind speed
* PM ( fine_dust )
* PM2.5 ( super_fine_dust )
* Ultraviolet ( ultraviolet_rays )
* Sunset
* class

```javascript
// 사용한 데이터베이스 컬럼
const weatherColumns = [ 
    'temperature', 'filling_temperature', 'meteoric_water', 'humidity',
    'wind_direction', 'wind_speed', 'fine_dust', 'super_fine_dust', 
    'ultraviolet_rays', 'sunset', 'class' 
  ];
```

---

### 2. 🌊 callPuppteer

puppteer 라이브러리를 사용한 크롤링 함수입니다.

```javascript
const callPuppetter = async (serchKeyword, classKeyword) => {  
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  // 미리 저장한 url과 serchKeyword를 인코딩해 조합합니다.
  await page.goto(using_url + encodeURI(serchKeyword)); 

  const PuppteerArray = await page.evaluate((classKeyword) => {
    const numElements = Array.from(document.querySelectorAll(classKeyword));
    const numbers = numElements.map(element => parseInt(element.textContent, 10));

    // 크롤링 직후의 데이터는 classKeyword를 가진 클래스의 모든 정보를 가져오기 때문에 지저분합니다.
    const flteredNumbers =  무작위 데이터;

	// 추가적인 처리를 진행하고 반환
    return filteredNumbers;
  }, classKeyword);

  return PuppteerArray;
};
```

반환된 PuppteerArray 값은 변수에 저장할 수 있습니다.

```javascript
// callPuppetter 함수는 비동기식이기 때문에 await을 사용할 필요가 있습니다.
const Example = await callPuppetter(serchKeyword, classKeyword);

const ExampleJSON = JSON.stringify({ data: Example });

updateDatabase('YOUR_DB_IN_TABLE', ['COLUMNS'], [ ExampleJSON ] )
```

동시에 다수의 데이터를 DB에 업데이트 할 수 있습니다. 

단, 여러 테이블을 동시에 업데이트하기 위해선 함수를 반복해 사용해야 합니다.

---

### 3. 💾 updataDatabase 

mySQL 노드 라이브러리를 사용해 DB에 연결하고 데이터를 저장하는 함수입니다.

```javascript
// example
updateDatabase('database.table', columns, values); // ..or
updateDatabase('database.table', columns, values, 'function');
```


코드 실행 후 콜백할 수 있습니다.

---

### MDP (Meister Development Project)
**'Meister Development Project'** is an annual team project at school.
- 전공 동아리 활동
- 프로젝트 팀 편성

## 🔖 Eat & Growth

<a href="https://en.wikipedia.org/wiki/HTML5"><img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white"></a>
<a href="https://www.w3.org/TR/CSS/#css"><img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white"></a>
<a href="https://www.ecma-international.org/publications-and-standards/standards/ecma-262/"><img src="https://img.shields.io/badge/JAVASCRIPT-F7DF1E?style=flat-square&logo=JAVASCRIPT&logoColor=black"></a>
<a href="https://www.php.net/"><img src="https://img.shields.io/badge/PHP-777BB4?style=flat-square&logo=PHP&logoColor=white"> </a>

- [MDP](http://intec.icehs.kr/sub/info.do?m=040101&s=intec)
- [Node.js](https://nodejs.org/ko)
- 야호 끝이다 (2023.4.?? ~ 2023.9.25)
