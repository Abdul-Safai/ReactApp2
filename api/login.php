<?php
require __DIR__ . '/config.php';

const LOCK_MAX_ATTEMPTS = 3;
const LOCK_DURATION_MIN = 2; 

$in = read_json();
$email = strtolower(trim($in['email'] ?? ''));
$pass  = (string)($in['password'] ?? '');

if ($email === '' || $pass === '') {
  json_out(['error' => 'Please enter both email and password.'], 400);
}

$st = $pdo->prepare('SELECT id,name,email,password_hash,role,failed_attempts,lock_until
                     FROM users WHERE email = ? LIMIT 1');
$st->execute([$email]);
$user = $st->fetch();

if (!$user) {
  usleep(300000);
  json_out(['error' => 'We couldn’t sign you in. Please check your email and password and try again.'], 401);
}

if (!empty($user['lock_until'])) {
  $now = new DateTime('now');
  $until = new DateTime($user['lock_until']);
  if ($now < $until) {
    $secs = max(1, $until->getTimestamp() - $now->getTimestamp());
    json_out([
      'error' => 'Your account is temporarily locked.',
      'lock_remaining_seconds' => $secs
    ], 423);
  }
}

if (!password_verify($pass, $user['password_hash'])) {
  $fails = min(255, ((int)$user['failed_attempts']) + 1);
  if ($fails >= LOCK_MAX_ATTEMPTS) {
    $until = (new DateTime('now'))->modify('+' . LOCK_DURATION_MIN . ' minutes')->format('Y-m-d H:i:s');
    $pdo->prepare('UPDATE users SET failed_attempts = 0, lock_until = ? WHERE id = ?')
        ->execute([$until, (int)$user['id']]);
    json_out([
      'error' => 'Too many unsuccessful sign-in attempts. Your account is locked.',
      'lock_remaining_seconds' => LOCK_DURATION_MIN * 60
    ], 423);
  } else {
    $pdo->prepare('UPDATE users SET failed_attempts = ? WHERE id = ?')
        ->execute([$fails, (int)$user['id']]);
    json_out(['error' => 'We couldn’t sign you in. Please check your email and password and try again.'], 401);
  }
}

$pdo->prepare('UPDATE users SET failed_attempts = 0, lock_until = NULL WHERE id = ?')
    ->execute([(int)$user['id']]);

$token = new_token();
$expires = (new DateTime('+24 hours'))->format('Y-m-d H:i:s');
$st = $pdo->prepare('INSERT INTO sessions (token,user_id,expires_at) VALUES (?,?,?)');
$st->execute([$token, (int)$user['id'], $expires]);

json_out([
  'token' => $token,
  'user'  => [
    'id'   => (int)$user['id'],
    'name' => $user['name'],
    'email'=> $user['email'],
    'role' => $user['role']
  ]
], 200);
