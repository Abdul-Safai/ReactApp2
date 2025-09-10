<?php
require __DIR__ . '/config.php';

$in = read_json();
$name = trim($in['name'] ?? '');
$email = strtolower(trim($in['email'] ?? ''));
$pass = (string)($in['password'] ?? '');
$role = ($in['role'] ?? 'user') === 'admin' ? 'admin' : 'user';
$adminCode = (string)($in['adminCode'] ?? '');

if ($name === '' || $email === '' || $pass === '') {
  json_out(['error' => 'All fields are required.'], 400);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  json_out(['error' => 'Invalid email.'], 400);
}
if ($role === 'admin' && $adminCode !== $ADMIN_SECRET) {
  json_out(['error' => 'Invalid admin secret.'], 403);
}

// unique email?
$st = $pdo->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
$st->execute([$email]);
if ($st->fetch()) json_out(['error' => 'Email already registered.'], 409);

$hash = password_hash($pass, PASSWORD_DEFAULT);
$st = $pdo->prepare('INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,?)');
$st->execute([$name, $email, $hash, $role]);
$user_id = (int)$pdo->lastInsertId();

// issue token
$token = new_token();
$expires = (new DateTime('+24 hours'))->format('Y-m-d H:i:s');
$st = $pdo->prepare('INSERT INTO sessions (token,user_id,expires_at) VALUES (?,?,?)');
$st->execute([$token, $user_id, $expires]);

json_out([
  'token' => $token,
  'user'  => ['id'=>$user_id, 'name'=>$name, 'email'=>$email, 'role'=>$role]
], 201);
