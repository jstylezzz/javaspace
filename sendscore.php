<?php

include("sqlCredentials.php");

$con = mysqli_connect($SQL_HOST, $SQL_USER, $SQL_PASS, $SQL_DB);

$name = mysqli_real_escape_string($con, $_GET['pName']);
$score = mysqli_real_escape_string($con, $_GET['pScore']);
$shotsFired = mysqli_real_escape_string($con, $_GET['pShots']);
$time = mysqli_real_escape_string($con, $_GET['pTime']);
$level = mysqli_real_escape_string($con, $_GET['pLevel']);


mysqli_query($con, "INSERT INTO `highscore` (playerName, score, secondsPlayed, level, shotsFired) VALUES ('".$name."','".$score."', '".$time."', '".$level."', '".$shotsFired."')");

mysqli_close($con);

?>