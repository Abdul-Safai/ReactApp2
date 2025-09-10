<?php
require __DIR__ . '/config.php';

$in = read_json();
$email = strtolower(trim($in['email'] ?? ''));
$pass = (string)($in['password'] ?? '');

if ($email === '' || $pass === '') {
  json_out(['error'=>'Email and password required.'], 400);
}

$st = $pdo->prepare('SELECT id,name,email,password_hash,role FROM users WHERE email = ? LIMIT 1');
$st->execute([$email]);
$user = $st->fetch();

if (!$user || !password_verify($pass, $user['password_hash'])) {
  json_out(['error'=>'Invalid email or password.'], 401);
}

$token = new_token();
$expires = (new DateTime('+24 hours'))->format('Y-m-d H:i:s');
$st = $pdo->prepare('INSERT INTO sessions (token,user_id,expires_at) VALUES (?,?,?)');
$st->execute([$token, (int)$user['id'], $expires]);

json_out([
  'token' => $token,
  'user'  => [
    'id'=>(int)$user['id'],
    'name'=>$user['name'],
    'email'=>$user['email'],
    'role'=>$user['role']
  ]
], 200);
