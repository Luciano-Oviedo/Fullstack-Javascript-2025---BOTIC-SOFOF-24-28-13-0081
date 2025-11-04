# Evaluación de portafolio - Módulo 7

1. Proyecto: simular una aplicación web para gestionar los usuarios y los pedidos de una tienda en línea.

2. Objetivos:

- Realizar operaciones CRUD (crear, leer, actualizar y eliminar) sobre las tablas de usuarios y pedidos en una base de datos PostgreSQL.
- Implementar la conexión a la base de datos PostgreSQL utilizando buenas prácticas en el entorno Node.js.
- Diseñar y manejar las relaciones entre las entidades de usuarios y pedidos de manera eficiente y escalable.
- Utilizar un ORM como Sequelize para interactuar con la base de datos de manera sencilla.

P.D.: esta vez implementé las validaciones de ingreso, tipo y formato de datos directamente en la definición de los modelos, aprovechando la propiedad 'validate' de Sequelize. Las validaciones en las funciones CRUD son netamente para comprobar registros duplicados o inexistentes a la hora de hacer consultas.

## Configuración y ejecución de la aplicación

1. Clonar el repositorio.

2. Situarse en el directorio del proyecto desde la terminal y ejecutar el comando `npm install`, para instalar todas las dependencias de la aplicación.

3. Ejecutar el comando `npm run start` para iniciar el servidor.

## Como hacer pruebas de rutas con Postman

Crear una nueva request en Postman y asegurarse de que el servidor esté en ejecución. Luego, probar cada ruta con los siguientes parámetros:

1. Crear usuario

- Método: POST

- Ruta: http://localhost:3000/usuarios

- Ejemplo body (JSON):

```
{
"nombre": "María Pérez",
"email": "maria@example.com",
"contrasena": "Clave#1234"
}
```

Respuesta esperada (201):

```
{
"mensaje": "Usuario creado exitosamente",
"usuario": {
"id": 1,
"nombre": "María Pérez",
"email": "maria@example.com"
}
}
```

2️. Crear pedido

- Método: POST

- Ruta: http://localhost:3000/pedidos

- Ejemplo body (JSON):

```
{
"usuario_id": 1,
"producto": "Teclado mecánico",
"cantidad": 2,
"fecha_pedido": "2025-11-03"
}
```

Respuesta esperada (201):

```
{
"mensaje": "Pedido creado exitosamente",
"pedido": {
"id": 1,
"usuario_id": 1,
"producto": "Teclado mecánico",
"cantidad": 2,
"fecha_pedido": "2025-11-03"
}
}
```

3️. Obtener usuarios

- Método: GET

- Ruta: http://localhost:3000/usuarios

Respuesta esperada (200):

```
{
"mensaje": "Lista de usuarios",
"usuarios": [
{
"id": 1,
"nombre": "María Pérez",
"email": "maria@example.com"
}
]
}
```

4️. Obtener pedidos de un usuario

- Método: GET
- Formato ruta: http://localhost:3000/usuarios/:id/pedidos
- Ejemplo ruta: http://localhost:3000/usuarios/1/pedidos

Respuesta esperada (200):

```
{
  "mensaje": "Pedidos del usuario obtenidos correctamente",
  "pedidos": {
    "usuario": "María Pérez",
    "email": "maria@example.com",
    "pedidos": [
      {
        "id": 1,
        "producto": "Teclado mecánico",
        "cantidad": 2,
        "fecha_pedido": "2025-11-03"
      }
    ]
  }
}

```

5️. Actualizar usuario

- Método: PUT
- Formato ruta: http://localhost:3000/usuarios/:id
- Ejemplo ruta: http://localhost:3000/usuarios/1
- Ejemplo body (JSON):

```
{
"nuevoNombre": "María P. Delgado",
"nuevoEmail": "marialu@example.com",
"nuevaContrasena": "Clave#5678"
}
```

Respuesta esperada (200):

```
{
"mensaje": "Usuario actualizado correctamente",
"usuario": {
"id": 1,
"nombre": "María P. Delgado",
"email": "marialu@example.com"
}
}
```

6️. Eliminar usuario

- Método: DELETE

- Ruta: http://localhost:3000/usuarios/1

Respuesta esperada (200):

```
{
"mensaje": "Usuario con ID 1 eliminado correctamente"
}
```

Para probar el manejo de errores y las validaciones de cada ruta, se pueden omitir campos del cuerpo, ingresar formatos o tipos de datos distintos a los esperados, tratar de crear recursos con duplicados de campos únicos (dos usuarios usando el mismo email, por ejemplo) o actualizar/eliminar recursos con IDs que no existan.
