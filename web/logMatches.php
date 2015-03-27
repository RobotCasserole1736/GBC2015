<?php
$file = fopen('matchData.csv', 'a');
$data = $_GET['matchData'];
fwrite($file, $data);
fwrite($file, "\n");
fclose($file);
?>