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
    /** regist Account
     *  'water' table in 'grade' value defalt is '1'
     */
    $sqls = array(
        "INSERT INTO login (user_id, user_password, user_name) VALUES ('$id', '$password', '$name')",
        "INSERT INTO hardware_infomation (user_id) VALUES ('$id')"
    );

    foreach ($sqls as $sql) {
        if ($conn->query($sql) === TRUE) {
            echo "SQL 실행 성공: " . $sql . "<br>";
        } else {
            echo "SQL 실행 실패: " . $sql . "<br>" . $conn->error;
        }
    }
    
    header('Location: ../login.html');
}
$conn->close();
?>