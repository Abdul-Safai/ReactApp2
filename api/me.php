<?php
require __DIR__ . '/config.php';

$token = bearer_token();
if (!$token) json_out(['error'=>'Missing token'], 401);

$st = $pdo->prepare('SELECT s.token, s.expires_at, u.id, u.name, u.email, u.role
                     FROM sessions s
                     JOIN users u ON u.id = s.user_id
                     WHERE s.token = ? LIMIT 1');
$st->execute([$token]);
$row = $st->fetch();
if (!$row) json_out(['error'=>'Invalid token'], 401);

if (new DateTime($row['expires_at']) < new DateTime()) {
  $pdo->prepare('DELETE FROM sessions WHERE token = ?')->execute([$token]);
  json_out(['error'=>'Token expired'], 401);
}

json_out([
  'user' => [
    'id'=>(int)$row['id'],
    'name'=>$row['name'],
    'email'=>$row['email'],
    'role'=>$row['role']
  ]
], 200);
