<?php
require_once('../../server/db_conn.php');
ob_start();
$id = $_POST["id"];
$password = $_POST["password1"];
$name = $_POST["name"];

if (empty($id) || empty($password) || empty($name)) {
    echo "null error<br>";
    echo "id: ".$id."<br>";
    echo "pw: ".$password."<br>";
    echo "nm: ".$name."<br>";
} 
else {
    $sql = "INSERT INTO login (user_id, user_password, user_name)
    VALUES ('$id', '$password', '$name')";
    if (mysqli_query($conn, $sql)) {
        echo "회원 정보가 등록되었습니다.";
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    }
header('Location: ../login.html');
}

?>