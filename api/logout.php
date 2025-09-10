<?php
require __DIR__ . '/config.php';
$token = bearer_token();
if ($token) {
  $pdo->prepare('DELETE FROM sessions WHERE token = ?')->execute([$token]);
}
json_out(['ok'=>true], 200);
