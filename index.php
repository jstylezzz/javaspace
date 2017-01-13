
<!doctype html>
<html>
	<head>
	<title>JavaSpace &bull; By Jari Senhorst (Jstylezzz)</title>
	</head>
	<body>
	<canvas id="gameCanvas"></canvas>
	<script type="text/javascript" src="backend/game.js"></script>
	
	<div id="scorediv" style="float: right; text-align: center; width: 36%; height: 80%; overflow: horizontal; background-color: #6699ff;">
		<h2>Highscore</h2>
		
		<table style="width: 100%">
			<tr>
				<td><b>Player Name</b></td>
				<td><b>Score</b></td>
				<td><b>Time played</b></td>
				<td><b>Shots fired</b></td>
				<td><b>Level (4 is start level)</b></td>
			</tr>
		<?php
		include("backend/sqlCredentials.php");
		$scoreData = null;
		$records = 0;
		$con = mysqli_connect($SQL_HOST, $SQL_USER, $SQL_PASS, $SQL_DB);
		$result = mysqli_query($con, "SELECT * FROM `highscore` ORDER BY `score` DESC LIMIT 20;");
		while($row = mysqli_fetch_assoc($result))
		{
			echo '<tr>
				<td>'.$row['playerName'].'</td>
				<td>'.$row['score'].'</td>
				<td>'.gmdate("H:i:s", $row['secondsPlayed']).'</td>
				<td>'.$row['shotsFired'].'</td>
				<td>'.$row['level'].'</td>
				</tr>';
			
		}

		mysqli_close($con);
		?>
		</table>
	</div>
	</body>
</html>