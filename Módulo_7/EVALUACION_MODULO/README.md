# Módulo 7 - Evaluación de módulo

## Descripción del reto

Crear una aplicación web para gestionar usuarios y roles, utilizando las siguientes características:

1. Conexión a la base de datos PostgreSQL utilizando buenas prácticas de conexión.

2. Implementación de un modelo de datos utilizando un ORM (Sequelize).

3. Realización de operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre las tablas de usuarios y roles.

4. Implementación de transacciones para asegurar la integridad y consistencia de los datos.

5. Uso de asociaciones uno a uno, uno a muchos y muchos a muchos entre las entidades.

## Configuración y ejecución de la aplicación:

1. Clonar el repositorio.

2. Situarse en el directorio del proyecto desde la terminal y ejecutar el comando `npm install`, para instalar todas las dependencias de la aplicación.

3. Ejecutar el comando `npm run start` para iniciar el servidor.

4. Probar las distintas rutas especificadas en el archivo **app.js** usando Postman:

Crear una nueva request en Postman y asegurarse de que el servidor esté en ejecución.

A. Crear rol:

- Método: POST
- URL: http://localhost:4020/roles
- Body → raw → JSON:

```json
{
  "nombre": "string"
}
```

B. Crear usuario:

- Método: POST
- URL: http://localhost:4020/usuarios
- Body → raw → JSON:

```json
{
  "nombre": "string",
  "correo": "string",
  "contrasena": "string",
  "id_rol": "integer"
}
```

C. Obtener datos:

- GET /usuarios → Lista todos los usuarios.

- GET /usuarios/:id → Muestra un usuario específico.

- GET /roles → Lista todos los roles.

- GET /roles/:id → Muestra un rol específico.

- Ejemplo:

```
GET http://localhost:4020/usuarios/1
```

D. Actualizar usuario:

- Método: PATCH
- URL: http://localhost:4020/usuarios/1
- Body → raw → JSON:

```json
{
  "nuevoNombre": "string",
  "nuevoCorreo": "string",
  "nuevaContrasena": "string"
}
```

E. Actualizar rol:

- Método: PATCH
- URL: http://localhost:4020/roles/1
- Body → raw → JSON:

```json
{
  "nuevoNombre": "string"
}
```

F. Eliminar registros:

- DELETE /usuarios/:id

- DELETE /roles/:id

- Ejemplo:

```
DELETE http://localhost:4020/usuarios/1
```

Para probar las validaciones de cada ruta, se pueden omitir campos del cuerpo o ingresar tipos de datos distintos a los esperados para verificar el manejo de errores por parte de la API.
