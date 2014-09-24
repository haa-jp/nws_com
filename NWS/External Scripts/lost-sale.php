<?php
date_default_timezone_set('America/Chicago');
require_once('class.phpmailer.php');
require_once('class.smtp.php');

$fields = Array();

$fields['customer'] = $_POST['customer'];
$fields['code'] = $_POST['code'];
$fields['name'] = $_POST['name'];
$fields['email'] = $_POST['email'];
$fields['quantity'] = $_POST['quantity'];
$fields['comment'] = $_POST['comment'];
$fields['timestamp'] = date('r');

$message = '';

foreach ($fields as $key=>$value) {
	$message .= ucfirst($key) . ': ' . htmlentities($value) . '<br />';
}
$mail = new PHPMailer();
$mail->IsSMTP();
$mail->Host = "nws-mail.nws.local";
$mail->AddAddress('webadmin@northernwholesale.com','Northern Wholesale');
$mail->SetFrom('no-reply@northernwholesale.com','Lost Sale');
$mail->AddReplyTo('no-reply@northernwholesale.com');
$mail->Subject = 'Lost Sale message';
$mail->IsHTML(true);
$mail->Body = $message;

if ($mail->Send()) {
	$url = 'http://192.168.1.1:89/ws/lostsale.php';
	$data = array('itemNumber' => $fields['code'], 'quantity' => $fields['quantity']);

	$options = array(
	    'http' => array(
	        'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
	        'method'  => 'POST',
	        'content' => http_build_query($data),
	    ),
	);
	$context  = stream_context_create($options);
	$result = file_get_contents($url, false, $context);
	
	header('Content-type: application/json');
	echo '{"message":"Message sent"}';	
}