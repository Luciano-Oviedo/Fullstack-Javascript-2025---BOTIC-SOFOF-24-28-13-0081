# Evaluación de módulo: API REST para gestión de usuarios y archivos con autenticación por JWT

### Objetivo general

Desarrollar una API REST utilizando **Node.js** y **Express** que permita la gestión de archivos y servicios de autenticación con **JSON Web Tokens (JWT)**, implementando buenas prácticas para el diseño de la API REST y la seguridad en el servicio.

### Descripción del reto

Crear una API REST que permita a los usuarios subir archivos, interactuar con recursos en el servidor y asegurar las rutas utilizando JWT para autenticación. Esta API debe seguir las buenas prácticas para diseño de una arquitectura RESTful y garantizar la interoperabilidad entre sistemas.

---

## Estructura del proyecto

```
PROYECTO
┣ 📂controllers
┃ ┣ 📜gestionUsuarios.controller.js
┃ ┗ 📜subirArchivos.controller.js
┣ 📂middlewares
┃ ┣ 📜auth.middleware.js
┃ ┗ 📜datosUsuario.middleware.js
┣ 📂routes
┃ ┣ 📜gestionUsuarios.router.js
┃ ┗ 📜subirArchivos.router.js
┣ 📂uploads
┣ 📜.env.demo
┣ 📜app.js
┣ 📜package.json
┗ 📜README.md
```

- **.env.demo:** contiene los nombres de las variables de entorno a configurar para el correcto funcionamiento de la API.

- **app.js:** archivo principal de la API. Contiene la configuración del servidor, la configuración de middlewares globales -_fileupload()_, _express(json())_, middleware de rutas inexistentes y de errores internos del servidor- y las rutas para gestión de usuarios `/api/users` y subida de archivos `/api/files`.

- **/controllers:** _gestionUsuarios.controller.js_ contiene la lógica de registro y login de usuarios de la API, _subirArchivos.controller.js_ contiene la lógica para la subida de archivos al servidor.

- **/routes:** contiene los routers para la gestión de usuarios -_gestionUsuarios.router.js_- y subida de archivos -_subirArchivos.router.js_-. Los routers para la gestión de usuarios están configurados con un middleware de validación de ingreso, tipo y formato de datos de usuario. El router de subida de archivos está configurado con un middleware de autenticación de credenciales de usuario mediante _JWT_.

- **/middlewares:** contiene los middleware de _validación de datos de usuario_ y de _autenticación de JWT_ utilizados en los routers.

- **/uploads:** directorio destinado a guardar los archivos subidos por los usuarios al servidor.

---

## Instalación y configuración de la API

1. Clonar el repositorio.

2. Situarse en el directorio del proyecto desde la consola de comandos.

3. Instalar las dependencias con el comando: `npm install`.

4. Crear un archivo **.env** en el directorio raíz del proyecto, definiendo las variables de entorno contenidas en **.env.demo**.

5. Ejecutar el servidor con el comando: `npm start`.

---

## Pruebas con POSTMAN

1. Asegurarse que el servidor esté inicializado y corriendo en: http://localhost:3030.

2. Probar las rutas con estos parámetros:

| Método |                   Ruta                   |                                  Authorization                                   |                 Body                  |                                                Ejemplo contenido Body                                                 |                                                           Salida esperada                                                            |
| :----: | :--------------------------------------: | :------------------------------------------------------------------------------: | :-----------------------------------: | :-------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------: |
|  POST  | http://localhost:3030/api/users/register |                                        NO                                        |              Raw > JSON               |                          { "email": "ejemplo@correo.com", "password": "ejemplocontraseña" }                           | Status code 201: { "Mensaje": "Usuario registrado correctamente", "Usuario": "ejemplo@correo.com", "Token": "tokenGeneradoPorJWT" }  |
|  POST  |  http://localhost:3030/api/users/login   |                                        NO                                        |              Raw > JSON               | Debes repetir los datos de un usuario ya registrado: {"email": "ejemplo@correo.com", "password": "ejemplocontraseña"} | Status code 200: {"Mensaje": "Bienvenido/a 'ejemplo@correo.com', has iniciado sesión correctamente", "Token": "tokenGeneradoPorJWT"} |
|  POST  |  http://localhost:3030/api/files/upload  | SI: Auth Type > Bearer Token > Pegar token generado en rutas de registro o login | Form-data > Key: archivo > Type: file |      Subir un archivo que no sobrepase los 5MB de tamaño y que cumpla con las extensiones de archivo permitidas       |                     Status Code 201: {"Mensaje": "Tu archivo 'archivo.extension' ha sido subido correctamente"}                      |

3. Probar manejo de errores con estos parámetros:

| Método |                                         Ruta                                         |                 Tipo de error                 |                                                 Condición de error                                                 |                                         Salida esperada                                         |
| :----: | :----------------------------------------------------------------------------------: | :-------------------------------------------: | :----------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------: |
|  POST  | http://localhost:3030/api/users/register **o** http://localhost:3030/api/users/login |                 Body ausente                  |                         Enviar la petición sin Body (no seleccionar Raw > JSON en POSTMAN)                         |      Status code 404: { "Error": "Debes agregar un 'Body>raw>JSON' a esta petición HTTP" }      |
|  POST  | http://localhost:3030/api/users/register **o** http://localhost:3030/api/users/login | Email o password faltantes/vacíos/incorrectos |           No enviar alguno de los datos; enviar strings vacíos; enviarlos con un tipo distinto a string            |   Status code 400: { "Error": "Debes ingresar un email y contraseña válidos para continuar" }   |
|  POST  | http://localhost:3030/api/users/register **o** http://localhost:3030/api/users/login |           Formato inválido de email           |                          Escribir un email que no cumpla el formato 'correo@ejemplo.com'                           |     Status code 400: { "Error": "Debes ingresar un email en formato 'correo@ejemplo.com'" }     |
|  POST  |                       http://localhost:3030/api/users/register                       |             Usuario ya registrado             |                      Intentar registrar nuevamente un email que ya fue registrado previamente                      |        Status code 400: { "Mensaje": "Ya existe un usuario registrado con este email" }         |
|  POST  |                        http://localhost:3030/api/users/login                         |              Usuario inexistente              |                    Escribir un email válido en formato, pero que no esté registrado en memoria                     |               Status code 401: { "Mensaje": "Usuario o contraseña incorrectos" }                |
|  POST  |                        http://localhost:3030/api/users/login                         |             Contraseña incorrecta             |                  Ingresar un email registrado pero escribir una contraseña distinta a la original                  |               Status code 401: { "Mensaje": "Usuario o contraseña incorrectos" }                |
|  POST  |                        http://localhost:3030/api/files/upload                        |                 Token ausente                 |       No enviar el header Authorization; enviar Authorization vacío; no seleccionar Bearer Token en POSTMAN        |    Status code 401: { "Error": "Acceso denegado: No se proporcionó token de autenticación" }    |
|  POST  |                        http://localhost:3030/api/files/upload                        |           Token inválido o expirado           | Manipular el token; enviar un token inventado; enviar un token con estructura incorrecta; enviar un token expirado |        Status code 401: { "Error": "Acceso denegado: Token de autenticación inválido" }         |
|  POST  |                        http://localhost:3030/api/files/upload                        |              No se envió archivo              |                       No incluir la key `archivo` en form-data; enviar form-data sin archivo                       |                    Status code 400: { "Error": "No se han subido archivos" }                    |
|  POST  |                        http://localhost:3030/api/files/upload                        |          Múltiples archivos enviados          |               Seleccionar más de un archivo en POSTMAN bajo la misma key o crear varias keys archivo               |            Status code 400: { "Error": "Solo se permite subir un archivo a la vez" }            |
|  POST  |                        http://localhost:3030/api/files/upload                        |         Archivo supera tamaño máximo          |                  Subir un archivo que pese más de 5MB (por ejemplo, una imagen grande o un video)                  |      Status code 413: { "Error": "El archivo X excede el tamaño máximo permitido (5MB)" }       |
|  POST  |                        http://localhost:3030/api/files/upload                        |            Extensión no permitida             |  Subir un archivo con extensión no incluida en las permitidas (por ejemplo .exe, .bat, .zip si no está permitido)  | Status code 415: { "Error": "La extensión '.ext' del archivo 'archivo.ext' no está permitida" } |
