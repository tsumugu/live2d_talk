<?php
$api_key = $_GET["apikey"];
$url = "https://www.chaplus.jp/v1/chat?apikey=".$api_key;
$data_json = file_get_contents('php://input');
$ch = curl_init();
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
curl_setopt($ch, CURLOPT_POSTFIELDS, $data_json);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);
$result=curl_exec($ch);
$result_json = json_decode($result, true);
echo $result_json["bestResponse"]["utterance"];
curl_close($ch);