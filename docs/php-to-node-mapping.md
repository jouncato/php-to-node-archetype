# Mapeo Detallado: PHP 7 a Node.js 22

Este documento detalla cómo se traducen conceptos y patrones comunes de PHP 7 a Node.js 22 siguiendo este arquetipo.

## Estructuras de Control

| PHP 7                         | Node.js 22 (JavaScript)         |
| :---------------------------- | :------------------------------ |
| `if ($var)`                   | `if (var)`                      |
| `foreach ($array as $item)`   | `array.forEach(item => { ... })`|
| `for ($i = 0; $i < $count; $i++)` | `for (let i = 0; i < count; i++)` |
| `while ($condition)`          | `while (condition)`             |

## Funciones y Clases

| PHP 7                         | Node.js 22                      |
| :---------------------------- | :------------------------------ |
| `function nombreFuncion() {}` | `function nombreFuncion() {}` o `const nombreFuncion = () => {}` |
| `class NombreClase {}`        | `class NombreClase {}`          |
| `$this->metodo()`             | `this.metodo()`                 |
| `NombreClase::metodoEstatico()`| `NombreClase.metodoEstatico()`  |

## Manejo de Datos

| PHP 7                         | Node.js 22                      |
| :---------------------------- | :------------------------------ |
| `$_GET['param']`              | `req.query.param` (Express)     |
| `$_POST['field']`             | `req.body.field` (Express)      |
| `$_SESSION['key']`            | Se reemplaza por JWT en `req.user` |
| `$array = [];`                | `const array = [];`             |
| `$array[] = $item;`           | `array.push(item);`             |
| `count($array)`               | `array.length`                  |
| `$array['key']`               | `array.key` o `array['key']`    |

## Base de Datos (PDO vs mysql2)

| PHP 7 (PDO)                   | Node.js 22 (mysql2)             |
| :---------------------------- | :------------------------------ |
| `$pdo = new PDO(...)`         | `const dbClient = require('./config/database')` |
| `$stmt = $pdo->prepare($sql)` | `const [rows] = await dbClient.query(sql, params)` |
| `$stmt->execute([$param])`    | Incluido en `dbClient.query(sql, params)` |
| `$stmt->fetchAll()`           | `rows` (array de objetos)       |

## Autenticación

| PHP 7                         | Node.js 22                      |
| :---------------------------- | :------------------------------ |
| `session_start();`            | Se reemplaza por middleware JWT |
| `$_SESSION['user_id'] = $id;` | Se maneja con tokens JWT        |
| `if (!isset($_SESSION['user_id']))` | `authMiddleware` en rutas protegidas |

## Manejo de Errores

| PHP 7                         | Node.js 22                      |
| :---------------------------- | :------------------------------ |
| `try {} catch (Exception $e) {}` | `try {} catch (error) {}`    |
| `throw new Exception('Error')`| `throw new Error('Error')`      |
| Errores silenciosos           | Se capturan con middleware `errorHandler` |

## HTTP

| PHP 7                         | Node.js 22 (Express)            |
| :---------------------------- | :------------------------------ |
| `echo json_encode($data);`    | `res.json(data);`               |
| `http_response_code(404);`    | `res.status(404).json(...)`     |
| Headers HTTP                  | `res.header('Key', 'Value')`    |
| Redirecciones                 | `res.redirect('/ruta')`         |

## Archivos y Directorios

| PHP 7                         | Node.js 22                      |
| :---------------------------- | :------------------------------ |
| `require 'file.php';`         | `const module = require('./file')` |
| `__DIR__`                     | `__dirname`                     |
| `__FILE__`                    | `__filename`                    |