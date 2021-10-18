<?php
header("Content-Type: application/json; charset=utf-8");
$text = $_GET["text"];
if (empty($text)) {
  echo '{"res": "error"}';
  exit;
}
$accesskey = "";
$access_secret = "";
$req_body = array(
  "coefont" => "c8dcbebc-a909-4f32-aec8-d5eefc56e0cd",
  "text" => $text
);
$req_body_json = json_encode($req_body);
$timestamp = time();
$signature = hash_hmac("sha256", $timestamp.$req_body_json, $access_secret, false);
$req_header = array(
  "Content-Type:application/json",
  "Authorization:".$accesskey,
  "X-Coefont-Date:".$timestamp,
  "X-Coefont-Content:".$signature
);
//var_dump($req_header);
$ch = curl_init();
curl_setopt($ch, CURLOPT_HTTPHEADER, $req_header);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $req_body_json);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, "https://api.coefont.cloud/v1/text2speech");
$result=curl_exec($ch);
$info = curl_getinfo($ch);
$file_url = $info["redirect_url"];
if (!empty($file_url)) {
  echo '{"fileurl": "'.$file_url.'"}';
} else {
  echo '{"res": "error"}';
}
curl_close($ch);