# Arquetipo de Migración: PHP 7 a Node.js 22

Este proyecto es un arquetipo diseñado para facilitar la migración de servicios backend escritos en PHP 7 a Node.js 22, siguiendo principios de arquitectura limpia, SOLID y buenas prácticas de desarrollo.

## 📌 Propósito del Arquetipo

- Proporcionar una estructura base estandarizada para proyectos Node.js.
- Facilitar la migración incremental de servicios PHP 7.
- Aplicar principios de arquitectura limpia y SOLID.
- Incluir configuración completa para pruebas, CI/CD y desarrollo asistido por IA.

## 🔍 Análisis del Servicio PHP Original

### Ejemplo: `examples/php/user-service.php`

Este archivo contiene un servicio CRUD básico de usuarios en PHP 7, incluyendo:

- Conexión a base de datos MySQL con PDO.
- Endpoints REST para crear, leer, actualizar y eliminar usuarios.
- Validación de entrada básica.
- Manejo de errores con try/catch.
- Autenticación simple con sesiones.

### Funcionalidades Clave en PHP

1.  **`GET /usuarios`**: Listar todos los usuarios.
2.  **`GET /usuarios/{id}`**: Obtener un usuario por ID.
3.  **`POST /usuarios`**: Crear un nuevo usuario.
4.  **`PUT /usuarios/{id}`**: Actualizar un usuario existente.
5.  **`DELETE /usuarios/{id}`**: Eliminar un usuario.
6.  **`POST /login`**: Iniciar sesión de usuario.

## 🔄 Mapeo de PHP → Node.js

| Funcionalidad PHP                     | Implementación Node.js                          |
| :------------------------------------ | :---------------------------------------------- |
| `user-service.php` (lógica completa)  | `src/controllers/userController.js` + `src/services/userService.js` |
| Conexión PDO                          | `src/config/database.js` (usando `mysql2`)      |
| `$_POST`, `$_GET`                     | `req.body`, `req.params`, `req.query` (Express) |
| `try/catch` para manejo de errores    | `try/catch` en servicios + middleware `error.js`|
| Sesiones                              | Autenticación con JWT (`authService.js`)        |
| Funciones globales                    | `src/utils/helpers.js`                          |

## 📁 Estructura del Proyecto
