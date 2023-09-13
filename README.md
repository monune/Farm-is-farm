# Farm Is Farm

![main](https://github.com/monune/farm-is-farm/assets/123826926/307b5069-1af0-4d1c-8b42-ed34a7f3842f)



## Introduce

<a href="https://en.wikipedia.org/wiki/HTML5"><img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white"></a>
<a href="https://www.w3.org/TR/CSS/#css"><img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white"></a>
<a href="https://www.ecma-international.org/publications-and-standards/standards/ecma-262/"><img src="https://img.shields.io/badge/JAVASCRIPT-F7DF1E?style=flat-square&logo=JAVASCRIPT&logoColor=black"></a>
<a href="https://www.php.net/"><img src="https://img.shields.io/badge/PHP-777BB4?style=flat-square&logo=PHP&logoColor=white"> </a>

농장FARM니다는 기존 스마트 팜의 설비를 재정비하고 원격 제어를 돕는 LAN server 기반의 웹 서비스 입니다.



## Function


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

전체 동작은 parsing 함수 중심이며 실시간으로 날씨정보를 반환합니다.

아래는 자세한 함수 설명입니다.

---

### parsing 

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

### callPuppteer

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

### updataDatabase 

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
- [MDP](http://intec.icehs.kr/sub/info.do?m=040101&s=intec)
- [Node.js](https://nodejs.org/ko)
