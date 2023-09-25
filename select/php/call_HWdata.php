<?php
require_once('../../server/db_conn.php');

$id = $_POST["id"];
$data = $_POST["data"];
$post_array = $_POST["array"];
$post_value = $_POST["value"];
$post_string = $_POST["string"];

if (empty($id) || empty($data)) {
    echo "false"; 
} else { 
    if ($data === "hardware") {
    	$sql = "SELECT * FROM iemh_team1.hardware_infomation WHERE user_id = '$id'";
    	$result = $conn->query($sql);
    	$response = array();
		
    	if ($result->num_rows > 0) {
    	  $row = $result->fetch_assoc();
    	  $response["exists"] = true;
    	  $response["temp"] = $row["temperature"];
    	  $response["hum"] = $row["humidity"];
    	  $response["water"] = $row["water_grade"];
    	  $response["time"] = $row["timers"];
    	} else {
    	  $response["exists"] = false;
    	}
	
    	// 데이터 반환
    	header("Content-Type: application/json");
    	echo json_encode($response);
  	} else if ($data === "time") { // time 값 업데이트
		$sql = "UPDATE iemh_team1.hardware_infomation SET timers = '$post_array' WHERE user_id = '$id'";
        if ($conn->query($sql) === TRUE) {
            echo "SQL 실행 성공: " . $sql . "<br>";
        } else {
            echo "SQL 실행 실패: " . $sql . "<br>" . $conn->error;
        }
	} else if ($data === "light") {
		$sql = "UPDATE iemh_team1.hardware_infomation SET light_grade = '$post_value' WHERE user_id = '$id'";
        if ($conn->query($sql) === TRUE) {
            echo "SQL 실행 성공: " . $sql . "<br>";
        } else {
            echo "SQL 실행 실패: " . $sql . "<br>" . $conn->error;
        }
	} else if ($data === "save") {
		$filename = '../data/weatherData.txt';
		$file = fopen($filename, 'a'); // 'a'는 파일 끝에 추가하는 모드
		
		if ($file) {
			fwrite($file, $post_string . PHP_EOL); // PHP_EOL은 줄 바꿈 문자
		
			fclose($file);
		
			echo 'success';
		} else {
			echo 'false';
		}
	}
	$conn->close();
} ?>