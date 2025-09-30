# Módulo 6 - AE5 - ejercicio grupal, sala 4: gestor de inventario en Node.js

Este proyecto es una pequeña aplicación en Node.js que simula un **sistema de gestión de inventarios**. Los productos (con propiedades como nombre, precio y cantidad) se almacenan en un archivo JSON (`products.json`).  
Las operaciones CRUD (Crear, Leer, Actualizar y Eliminar) se realizan a través de rutas HTTP proporcionadas por un servidor Express.

## Probar las rutas con `curl`

Como no contamos con una interfaz de usuario, se pueden probar las rutas directamente desde la terminal usando `curl`.  
Asegúrate de que el servidor esté corriendo en `http://localhost:8020` y abre otra terminal para ejecutar los comandos `curl` (gitbash o CMD en Windows funcionan; PowerShell puede requerir otra sintaxis).

---

### 1. Crear un producto (POST)

Envía un producto nuevo al inventario. El cuerpo debe incluir:

- `id` (número único)
- `nombre` (string)
- `precio` (número mayor a 0)
- `cantidad` (número >= 0)

```
curl -X POST http://localhost:8020/products \
  -H "Content-Type: application/json" \
  -d '{"id":1,"nombre":"Teclado","precio":25.5,"cantidad":10}'
```

### 2. Obtener todos los productos (GET)

Devuelve el inventario completo:

```
curl http://localhost:8020/products
```

### 3. Modificar un producto por ID (PUT)

Actualiza uno o más campos de un producto existente (no se puede modificar el id):

```
curl -X PUT http://localhost:8020/products/1 \
  -H "Content-Type: application/json" \
  -d '{"precio":30.0,"cantidad":15}'
```

### 4. Eliminar un producto por ID (DELETE)

Elimina un producto específico del inventario:

```
curl -X DELETE http://localhost:8020/products/1
```

Notas:

- Para todas las rutas que requieren un id, reemplaza el valor en la URL por el ID del producto que deseas modificar o eliminar.
- La cantidad de un producto puede ser 0; esto no elimina automáticamente el producto.
- Si un id ya existe al crear un producto, la ruta POST devolverá un error.
