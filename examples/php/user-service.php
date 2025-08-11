<?php
// user-service.php - Ejemplo de servicio PHP 7 a migrar

// Configuración de la base de datos
$host = 'localhost';
$db   = 'php_migration';
$user = 'root';
$pass = 'password';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}

// Función para hashear contraseñas (simulación)
function hashPassword($password) {
    return password_hash($password, PASSWORD_DEFAULT);
}

// Función para verificar contraseñas (simulación)
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

// Obtener la ruta solicitada
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = $_SERVER['REQUEST_URI'];

// Parsear la ruta
$parsedUrl = parse_url($requestUri);
$path = $parsedUrl['path'];
$pathParts = explode('/', trim($path, '/'));

// Determinar el recurso
$resource = isset($pathParts[0]) ? $pathParts[0] : '';
$id = isset($pathParts[1]) ? $pathParts[1] : null;

// Establecer tipo de contenido
header('Content-Type: application/json');

try {
    if ($resource === 'usuarios') {
        switch ($method) {
            case 'GET':
                if ($id) {
                    // Obtener un usuario por ID
                    $stmt = $pdo->prepare('SELECT id, nombre, email, fecha_registro FROM usuarios WHERE id = ?');
                    $stmt->execute([$id]);
                    $user = $stmt->fetch();

                    if ($user) {
                        echo json_encode(['success' => true, 'data' => $user]);
                    } else {
                        http_response_code(404);
                        echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
                    }
                } else {
                    // Obtener todos los usuarios
                    $stmt = $pdo->query('SELECT id, nombre, email, fecha_registro FROM usuarios ORDER BY id ASC');
                    $users = $stmt->fetchAll();
                    echo json_encode(['success' => true, 'data' => $users]);
                }
                break;

            case 'POST':
                // Crear un nuevo usuario o iniciar sesión
                $input = json_decode(file_get_contents('php://input'), true);
                
                if (isset($input['action']) && $input['action'] === 'login') {
                    // Iniciar sesión
                    $email = $input['email'] ?? '';
                    $password = $input['password'] ?? '';

                    if (empty($email) || empty($password)) {
                        http_response_code(400);
                        echo json_encode(['success' => false, 'message' => 'Email y contraseña son obligatorios']);
                        break;
                    }

                    $stmt = $pdo->prepare('SELECT * FROM usuarios WHERE email = ?');
                    $stmt->execute([$email]);
                    $user = $stmt->fetch();

                    if ($user && verifyPassword($password, $user['password'])) {
                        session_start();
                        $_SESSION['user_id'] = $user['id'];
                        echo json_encode(['success' => true, 'message' => 'Inicio de sesión exitoso', 'data' => ['id' => $user['id'], 'nombre' => $user['nombre'], 'email' => $user['email']]]);
                    } else {
                        http_response_code(401);
                        echo json_encode(['success' => false, 'message' => 'Credenciales inválidas']);
                    }
                } else {
                    // Crear usuario
                    $nombre = $input['nombre'] ?? '';
                    $email = $input['email'] ?? '';
                    $password = $input['password'] ?? '';

                    if (empty($nombre) || empty($email) || empty($password)) {
                        http_response_code(400);
                        echo json_encode(['success' => false, 'message' => 'Nombre, email y contraseña son obligatorios']);
                        break;
                    }

                    // Verificar si el email ya existe
                    $stmt = $pdo->prepare('SELECT id FROM usuarios WHERE email = ?');
                    $stmt->execute([$email]);
                    if ($stmt->fetch()) {
                        http_response_code(400);
                        echo json_encode(['success' => false, 'message' => 'El email ya está registrado']);
                        break;
                    }

                    $hashedPassword = hashPassword($password);
                    $stmt = $pdo->prepare('INSERT INTO usuarios (nombre, email, password, fecha_registro) VALUES (?, ?, ?, NOW())');
                    $stmt->execute([$nombre, $email, $hashedPassword]);

                    $newUserId = $pdo->lastInsertId();
                    echo json_encode(['success' => true, 'message' => 'Usuario creado correctamente', 'data' => ['id' => $newUserId, 'nombre' => $nombre, 'email' => $email]]);
                }
                break;

            case 'PUT':
                if (!$id) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'message' => 'ID de usuario es obligatorio']);
                    break;
                }

                $input = json_decode(file_get_contents('php://input'), true);
                $nombre = $input['nombre'] ?? '';
                $email = $input['email'] ?? '';

                if (empty($nombre) || empty($email)) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'message' => 'Nombre y email son obligatorios']);
                    break;
                }

                $stmt = $pdo->prepare('UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?');
                $result = $stmt->execute([$nombre, $email, $id]);

                if ($result && $stmt->rowCount() > 0) {
                    echo json_encode(['success' => true, 'message' => 'Usuario actualizado correctamente']);
                } else {
                    http_response_code(404);
                    echo json_encode(['success' => false, 'message' => 'Usuario no encontrado o no se realizaron cambios']);
                }
                break;

            case 'DELETE':
                if (!$id) {
                    http_response_code(400);
                    echo json_encode(['success' => false, 'message' => 'ID de usuario es obligatorio']);
                    break;
                }

                $stmt = $pdo->prepare('DELETE FROM usuarios WHERE id = ?');
                $result = $stmt->execute([$id]);

                if ($result && $stmt->rowCount() > 0) {
                    echo json_encode(['success' => true, 'message' => 'Usuario eliminado correctamente']);
                } else {
                    http_response_code(404);
                    echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
                }
                break;

            default:
                http_response_code(405);
                echo json_encode(['success' => false, 'message' => 'Método no permitido']);
                break;
        }
    } else {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Recurso no encontrado']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error interno del servidor: ' . $e->getMessage()]);
}
?>