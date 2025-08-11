# Guía Detallada de Migración

Esta guía explica paso a paso cómo migrar un servicio PHP 7 a Node.js 22 utilizando este arquetipo.

## Paso 1: Análisis del Servicio PHP

1.  **Identifica las rutas y métodos HTTP:** `GET`, `POST`, `PUT`, `DELETE`.
2.  **Determina las entidades involucradas:** Usuarios, Productos, Pedidos, etc.
3.  **Analiza la lógica de negocio:** Validaciones, cálculos, flujos condicionales.
4.  **Revisa el acceso a datos:** Queries SQL, uso de PDO/MySQLi.
5.  **Documenta las dependencias:** Librerías externas, funciones auxiliares.

## Paso 2: Preparación del Entorno Node.js

1.  Clona este arquetipo.
2.  Crea una nueva rama para la migración: `git checkout -b feature/migracion-nuevo-servicio`.
3.  Configura tu `.env` con las credenciales de base de datos.
4.  Si es necesario, ajusta la conexión en `src/config/database.js`.

## Paso 3: Crear el Modelo

En `src/models/`, crea un archivo para tu entidad (ej: `Producto.js`).

- Define la clase con propiedades que mapeen a las columnas de la tabla.
- Incluye métodos de validación si es necesario.
- Implementa `toDatabaseRow()` y `toJSON()` para serialización.

## Paso 4: Crear el Repositorio

En `src/repositories/`, crea un archivo (ej: `productoRepository.js`).

- Define una clase que maneje todas las operaciones CRUD directamente con la base de datos.
- Usa `dbClient.query()` para ejecutar SQL.
- Devuelve instancias del modelo (`new Producto(row)`).

## Paso 5: Crear el Servicio

En `src/services/`, crea un archivo (ej: `productoService.js`).

- Inyecta el repositorio en el constructor.
- Implementa la lógica de negocio: validaciones, cálculos, coordinación entre repositorios si es necesario.
- Maneja errores y lanza excepciones específicas.
- Devuelve objetos planos (`toJSON()`) o datos primitivos.

## Paso 6: Crear el Controlador

En `src/controllers/`, crea un archivo (ej: `productoController.js`).

- Inyecta el servicio.
- Define métodos asíncronos para cada endpoint (`async getAllProductos(req, res)`).
- Extrae datos de `req` (params, body, query).
- Llama al servicio correspondiente.
- Envía respuestas JSON con códigos de estado HTTP apropiados.
- Maneja errores con bloques `try/catch` y devuelve respuestas de error estandarizadas.

## Paso 7: Definir las Rutas

En `src/routes/`, crea un archivo (ej: `productoRoutes.js`).

- Crea un `express.Router()`.
- Define las rutas con sus métodos HTTP y asocia los controladores.
- Aplica middleware de autenticación si es necesario (`authMiddleware`).

## Paso 8: Registrar las Rutas

En `src/app.js`, importa y usa las nuevas rutas:

```javascript
const productoRoutes = require('./routes/productoRoutes');
app.use('/api/productos', productoRoutes);