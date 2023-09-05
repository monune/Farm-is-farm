<?php
    require_once('../../server/db_conn.php');
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
    
    // 데이터 반환
    header("Content-Type: application/json");
    echo json_encode($response);
    
    $conn->close();
?>