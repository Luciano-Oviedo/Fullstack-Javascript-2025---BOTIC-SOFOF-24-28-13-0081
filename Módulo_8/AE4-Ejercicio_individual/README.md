# Sistema de autenticación de usuarios utilizando JSON Web Tokens (JWT) en una aplicación Node.js con Express

Esta aplicación en **Node.js** utiliza **Express** para crear una ruta de registro de usuarios `POST '/register'`, una ruta de inicio de sesión `POST '/login'` y una ruta para contenido protegido `GET '/profile'` que requiere la autenticación del usuario.

Además, se utiliza el paquete **jsonwebtoken** para crear un token en la ruta `/login` y para implementar un middleware de autenticación. Este middleware restringe el acceso a la ruta `/profile`, a menos que el usuario acceda con un token válido generado al iniciar sesión.

## Instalación y configuración

1. Clonar el repositorio.

2. Situarse en el directorio del proyecto desde la consola de comandos.

3. Instalar las dependencias con el comando: `npm install`.

4. Crear un archivo .env en la raíz del proyecto con el siguiente contenido: `SECRET_KEY=tu_clave_secreta`.

5. Ejecutar el servidor con el comando: `npm start`.

6. Verificar que el servidor esté corriendo en: `http://localhost:4020`.

## Pruebas con Postman

1. **Ruta `/register`**:

   - Método: POST

   - URL: http://localhost:4020/register

   - Body → raw → JSON:

```json
{
  "email": "usuario@correo.com",
  "password": "123456"
}
```

1.1 Caso exitoso (Status 201):

```json
{
  "Mensaje": "Usuario registrado correctamente"
}
```

1.2 Error: campos vacíos o tipos inválidos.

Prueba omitiendo uno de los campos, usando null, números o strings vacíos.

Salida esperada (Status 400):

```json
{
  "Mensaje": "Debes ingresar un email y contraseña válidos para continuar"
}
```

1.3 Error: usuario ya registrado.

Prueba registrando el mismo correo dos veces.

Salida esperada (Status 400):

```json
{
  "Mensaje": "Ya existe un usuario registrado con este email"
}
```

2. **Ruta `/login`**:

   - Método: POST

   - URL: http://localhost:4020/login

   - Body → raw → JSON:

```json
{
  "email": "usuario@correo.com",
  "password": "123456"
}
```

2.1 Caso exitoso (Status 200):

```json
{
  "Mensaje": "Has iniciado sesión",
  "Token": "JWT_GENERADO_AQUI"
}
```

2.2 Error: campos vacíos o tipos inválidos.

Prueba omitiendo uno de los campos, usando null, números o strings vacíos.

Salida esperada (Status 400):

```json
{
  "Mensaje": "Debes ingresar un email y contraseña válidos para continuar"
}
```

2.3 Error: usuario no registrado o contraseña incorrecta.

Prueba iniciar sesión con un correo que no hayas registrado, o usar una contraseña incorrecta con un usuario registrado.

Salida esperada (Status 401):

```json
{
  "Mensaje": "Usuario o contraseña incorrectos"
}
```

3. **Ruta `/profile`**:

   - Método: GET

   - URL: http://localhost:4020/profile

   - Headers → Authorization → Bearer Token: pegar el valor del campo 'Token' generado en la ruta `/login`, sin comillas.

3.1 Caso exitoso (Status 200):

```json
{
  "Mensaje": "Usuario: usuario@correo.com. Bienvenido a tu perfil"
}
```

3.2 Error: sin token.

Deja el campo Authorization vacío.

Salida esperada (Status 401):

```json
{
  "Mensaje": "Acceso denegado: No se proporcionó token"
}
```

3.3 Error: token inválido, alterado o expirado.

Pega un token modificado o incorrecto, o espera más de una hora con un token válido y vuelve a intentar la petición.

Salida esperada (Status 401):

```json
{
  "Mensaje": "Acceso denegado: Token inválido"
}
```
