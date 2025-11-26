# API REST para gestión de usuarios en aplicación de Redes Sociales

### Objetivo general

Desarrollar una **API REST** utilizando **Node.js** y **Express** para gestionar perfiles de usuario en una aplicación tipo red social. La API permite crear, obtener, actualizar y eliminar perfiles, subir imágenes de perfil, y protege rutas mediante autenticación con **JWT**. Además, utiliza buenas prácticas de seguridad y arquitectura RESTful.

### Descripción

Este backend ofrece un servicio web para la gestión segura de perfiles de usuario, con autenticación basada en JSON Web Tokens (JWT). Los usuarios pueden registrarse, iniciar sesión, actualizar su información, eliminar su cuenta y subir una imagen de perfil. La subida de archivos se gestiona con **File Uploader**, validando tipo y tamaño de imagen. Solo usuarios autenticados pueden acceder a ciertas funcionalidades protegidas.

## Estructura del proyecto

```
API GESTION USUARIOS RRSS
┣ 📂db
┃ ┣ 📜clientDB.js          # Módulo para operaciones con base de datos JSON
┃ ┗ 📜db.json             # Archivo JSON que actúa como base de datos
┣ 📂src
┃ ┣ 📂controllers
┃ ┃ ┣ 📜authUsuarios.controller.js      # Controladores de registro de usuario, inicio de sesión y refresco de sesión
┃ ┃ ┗ 📜gestionUsuarios.controller.js   # Controladores para CRUD y subida de imagen de perfil
┃ ┣ 📂middlewares
┃ ┃ ┣ 📜authUsuarios.middleware.js      # Middleware de autenticación y autorización JWT
┃ ┃ ┗ 📜datosUsuarios.middleware.js     # Middleware de validación de datos de usuario
┃ ┗ 📂routes
┃   ┗ 📜usuarios.Router.js                # Configuración de rutas
┣ 📂uploads                            # Carpeta para almacenar imágenes de perfil subidas
┣ 📜.env.demo                         # Ejemplo de variables de entorno a configurar
┣ 📜app.js                           # Archivo principal de configuración y arranque del servidor
┣ 📜package.json                     # Dependencias y scripts del proyecto
┗ 📜README.md                       # Documentación del proyecto (este archivo)
```

## Instalación y configuración

1. Clonar el repositorio.

2. Abrir una terminal y posicionarse en el directorio raíz del proyecto.

3. Ejecutar `npm install` para instalar las dependencias.

4. Crear un archivo .env en la raíz, copiando las variables desde .env.demo y asignando los valores correspondientes.

5. Ejecutar el servidor con `npm start`

## Uso y pruebas con Postman

### 1. Uso de tokens

Cuando realizas un registro o login válido, la API **no devuelve los tokens en el cuerpo de la respuesta**, sino que los adjunta en la pestaña **Headers** de la respuesta en Postman. Ahí encontrarás:

- El **access token** en el campo `authorization`, con formato: `Bearer <token>`.
- El **refresh token** en el campo `refresh-token`.

Para probar las rutas protegidas:

- Si la ruta requiere un **access token**, puedes copiar el valor completo del token y pegarlo en el campo `authorization` en la pestaña **Headers** de la nueva petición, creando el campo manualmente si no existe. O, como alternativa más simple, puedes pegar solo el token (sin el prefijo `Bearer`) en la pestaña **Authorization > Type > Bearer Token**.

- Si la ruta requiere un **refresh token**, crea manualmente un nuevo campo llamado `refresh-token` en la pestaña **Headers** de la petición y pega allí el valor del token.

Nota: siempre cuida de no dejar espacios vacíos antes del token al pegarlo en el campo correspondiente.

### 2. Endpoints

Ruta base: `http://localhost:3030`

- **POST /usuarios** (Registrar usuario)

Body: Body > Raw > JSON

Ejemplo Body:

```json
{
  "name": "usuariodeprueba",
  "email": "ejemplo@mail.com",
  "password": "12345"
}
```

Status Code 201:

```json
{
  "mensaje": "Usuario registrado correctamente",
  "nombreUsuario": "usuariodeprueba",
  "email": "ejemplo@mail.com",
  "id": 1
}
```

- **POST /usuarios/login** (Iniciar sesión)

Body: Body > Raw > JSON

Ejemplo Body:

```json
{
  "email": "ejemplo@mail.com",
  "password": "12345"
}
```

Status Code 200:

```json
{
  "mensaje": "Has iniciado sesión usuariodeprueba",
  "link": { "rel": "self", "href": "/usuarios/1" }
}
```

- **GET /usuarios/:id** (Obtener perfil de usuario)

Autenticación/Autorización: sí, requiere access token.

Status Code 200:

```json
{
  "mensaje": "Bienvenido/a a tu perfil usuariodeprueba. Desde esta sección puedes subir una foto de perfil, editar tu información o eliminar tu perfil",
  "links": [
    { "rel": "upload", "href": "/usuarios/1/imagen" },
    { "rel": "update", "href": "/usuarios/1" },
    { "rel": "delete", "href": "/usuarios/1" }
  ]
}
```

- **PUT /usuarios/:id** (Actualizar perfil)

Autenticación/Autorización: sí, requiere access token.

Body: Body > Raw > JSON

Ejemplo Body:

```json
{
  "email": "nuevo@mail.com",
  "password": "nuevacontraseña"
}
```

También puedes omitir alguno de los campos y solo actualizar email o contraseña.

Status Code 200:

```json
{
  "mensaje": "Has actualizado tu información correctamente",
  "nombreUsuario": "usuariodeprueba",
  "email": "nuevo@mail.com",
  "link": { "rel": "self", "href": "/usuarios/1" }
}
```

- **DELETE /usuarios/:id** (Eliminar perfil)

Autenticación/Autorización: sí, requiere access token.

Status Code 200:

```json
{
  "mensaje": "Has eliminado tu perfil exitosamente"
}
```

- **POST /usuarios/:id/imagen** (Subir imagen de perfil)

Autenticación/Autorización: sí, requiere access token.

Body > Form-data > Key: `profileImg`, Type: `File`

Status Code 201:

```json
{
  "mensaje": "Felicitaciones, has actualizado tu imagen de perfil",
  "URL": "/uploads/imagen.jpg"
}
```

- **POST /usuarios/:id/refresh** (Renovar tokens)

Autenticación/Autorización: sí, requiere refresh token.

Status Code 200:

```json
{
  "mensaje": "Las credenciales de autenticación se renovaron con éxito",
  "link": { "rel": "self", "href": "/usuarios/1" }
}
```

### 3. Manejo de errores

#### Errores de registro y login

- **Usuario ya registrado:** Intentar registrar con un nombre o email que ya existe.  
  _Código: 400 Bad Request_
- **Datos incompletos o inválidos:** Faltan campos obligatorios o el formato es incorrecto (email, password, etc).  
  _Código: 400 Bad Request_
- **Credenciales incorrectas:** Contraseña o email incorrectos durante el login.  
  _Código: 401 Unauthorized_

#### Errores relacionados con autenticación y autorización (JWT)

- **Token de acceso ausente:** No se envía token en rutas protegidas.  
  _Código: 401 Unauthorized_
- **Token de acceso inválido o expirado:** Token manipulado, expirado o mal formado.  
  _Código: 401 Unauthorized_
- **Token de refresco ausente:** No se envía refresh token en ruta para renovación.  
  _Código: 401 Unauthorized_
- **Token de refresco inválido o rotado:** Refresh token inválido, expirado o diferente al almacenado.  
  _Código: 401 Unauthorized_
- **Acceso denegado por usuario no autorizado:** El usuario intenta acceder o modificar un recurso que no le pertenece.  
   _Código: 403 Forbidden_

#### Errores en subida de archivos

- **Sin archivos en la petición:** No se incluye archivo en la subida de imagen.  
  _Código: 400 Bad Request_
- **Múltiples archivos enviados:** Se envía más de un archivo en la misma petición.  
  _Código: 400 Bad Request_
- **Archivo excede tamaño máximo:** Archivo mayor a 5MB.  
  _Código: 413 Payload Too Large_
- **Extensión no permitida:** Archivo con extensión no soportada (no imagen).  
  _Código: 415 Unsupported Media Type_

#### Errores en gestión de usuarios

- **Email ocupado:** Intentar actualizar el email de un usuario utilizando un email que ya está en uso por otro usuario.  
  _Código: 400 Bad Request_
- **Usuario no encontrado:** Consultar, actualizar o eliminar un usuario inexistente.  
  _Código: 404 Not Found_

## Seguridad

- Contraseñas almacenadas cifradas con _bcrypt_.

- Tokens JWT firmados y con expiración (15 min para access tokens, 12 hrs para refresh tokens).

- Middleware para validar autenticación y autorización de usuarios a través de tokens.

- Validación estricta de formatos y tipos en los datos de entrada.
