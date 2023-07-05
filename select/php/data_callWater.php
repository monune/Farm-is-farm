<?php
// 3 sec delay callback
require_once('../../server/db_conn.php');

$id = $_POST["id"];

$sql = "SELECT grade FROM iemh_team1.water WHERE user_id = '$id'";

?>