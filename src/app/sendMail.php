<?php
// mail.php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://deine-domain.tld'); // anpassen
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Nur POST akzeptieren
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
  exit;
}

// Simple serverseitige Validierung
$name  = trim($_POST['name']  ?? '');
$email = trim($_POST['email'] ?? '');
$msg   = trim($_POST['message'] ?? '');
$hp    = trim($_POST['company'] ?? ''); // Honeypot-Feld (im Frontend verstecken)

if ($hp !== '') { // Bot erkannt
  http_response_code(200);
  echo json_encode(['ok' => true]); // still akzeptieren
  exit;
}

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $msg === '') {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Validation failed']);
  exit;
}

// PHPMailer laden (per Composer installiert und mit hochgeladenem vendor/-Ordner)
require __DIR__ . '/vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);
try {
  // SMTP Konfiguration (Daten aus all-inkl-Mailpostfach)
  $mail->isSMTP();
  $mail->Host       = 'smtp.<deine-domain.tld>';   // oder: 'secure.kundenserver.de' / all-inkl SMTP
  $mail->SMTPAuth   = true;
  $mail->Username   = 'kontakt@deine-domain.tld';
  $mail->Password   = '###STRONG_PASSWORD###';
  $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
  $mail->Port       = 587;

  $mail->setFrom('kontakt@deine-domain.tld', 'Website Kontaktformular');
  $mail->addAddress('du@deine-domain.tld'); // Empfänger
  $mail->addReplyTo($email, $name);

  $mail->Subject = 'Neue Kontaktanfrage';
  $mail->Body    = "Name: $name\nEmail: $email\n\nNachricht:\n$msg";
  $mail->AltBody = $mail->Body;

  $mail->send();
  echo json_encode(['ok' => true]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['ok' => false, 'error' => 'Mailer error']);
}
