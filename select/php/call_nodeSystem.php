<?php
  require_once('../../server/db_conn.php');

  $id = $_POST["id"];
  $data = $_POST["data"];

  if (empty($data)) {
    echo "none";
  }
  else if ($data == "chart") { // CONTROL 차트
    $sql = "SELECT * FROM iemh_team1.hardware_infomation WHERE user_id = '$id'";
    $result = $conn->query($sql);
    $response = array();
    
    if ($result->num_rows > 0) {
      $row = $result->fetch_assoc();
      $response["exists"] = true;
      $response["temp"] = $row["temperature"];
      $response["hum"] = $row["humidity"];
    } else {
      $response["exists"] = false;
    }
  } 
   // CONTROL 그래프
  else if ($data == "graph") {
    $sql = "SELECT * FROM iemh_team1.realtime_humidity";
    $result = $conn->query($sql);
    $response = array();
    
    if ($result->num_rows > 0) {
      $row = $result->fetch_assoc();
      $response["exists"] = true;
      $response["times"] = $row["times"];
      $response["docs"] = $row["docs"];
    } else {
      $response["exists"] = false;
      $response["times"] = "그냥 안됨";
    }
  } 

  else if ($data == "weather") { // WEATHER 탭
    $sql = "SELECT * FROM iemh_team1.weather";
    $result = $conn->query($sql);
    $response = array();
      
    if ($result->num_rows > 0) {
      $row = $result->fetch_assoc();
      $response["exists"] = true;
      $response["ftemp"] = $row["filling_temperature"];
      $response["temp"] = $row["temperature"];
      $response["mtr_water"] = $row["meteoric_water"];
      $response["hum"] = $row["humidity"];
      $response["wind_dir"] = $row["wind_direction"];
      $response["wind_spd"] = $row["wind_speed"];
      $response["fine"] = $row["fine_dust"];
      $response["sp_fine"] = $row["super_fine_dust"];
      $response["uvrays"] = $row["ultraviolet_rays"];
      $response["sunset"] = $row["sunset"];
      $response["class"] = $row["class"];
    } else {
      $response["exists"] = false;
    }
  }
  else {
    echo "default";
  } 
    
  // 데이터 반환
  header("Content-Type: application/json");
  echo json_encode($response);  
  $conn->close();
?>