<?php
// CORS for dev from Vite (http://localhost:5173)
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// ---- DB CONFIG (adjust for your setup) ----
$DB_HOST = '127.0.0.1';
$DB_NAME = 'reactapp2';
$DB_USER = 'root';
$DB_PASS = ''; // XAMPP default empty password

// Admin secret lives ONLY on the server
$ADMIN_SECRET = 'ADMIN2025';

try {
  $pdo = new PDO(
    "mysql:host={$DB_HOST};dbname={$DB_NAME};charset=utf8mb4",
    $DB_USER,
    $DB_PASS,
    [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]
  );
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['error' => 'DB connection failed']); exit;
}

function read_json() {
  $raw = file_get_contents('php://input');
  $data = json_decode($raw, true);
  return is_array($data) ? $data : [];
}
function json_out($data, $code=200) {
  http_response_code($code);
  echo json_encode($data);
  exit;
}
function bearer_token() {
  $hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
  if (preg_match('/Bearer\s+(\S+)/', $hdr, $m)) return $m[1];
  return null;
}
function new_token() {
  return bin2hex(random_bytes(32)); // 64 hex chars
}
