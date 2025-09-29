# Ejercicio individual AE5-MÓDULO 6: gestor de tareas en Node.js

Este proyecto es una pequeña aplicación en Node.js que permite gestionar tareas usando un archivo JSON como almacenamiento de datos persistentes.
Las operaciones CRUD (Crear, Leer, Actualizar y Eliminar) se realizan a través de rutas HTTP proporcionadas por un servidor Express.

## Probar las rutas con `curl`

Como no contamos con una interfaz de usuario, se pueden probar las rutas directamente desde la terminal usando `curl`.

Asegúrate de que el servidor esté corriendo en `http://localhost:8000` y abre otra terminal para ejecutar comandos `curl` (con gitbash o CMD en Windows, powershell tiene otra sintaxis y puede generar errores).

1. Obtener todas las tareas (GET):

   ```
   curl http://localhost:8000/tasks
   ```

2. Crear una nueva tarea (POST):
   ```
   curl -X POST http://localhost:8000/tasks \
   -H "Content-Type: application/json" \
   -d '{"id":"1","titulo":"Aprender curl","completada":false}'
   ```
3. Modificar una tarea existente (PUT):

   ```
   curl -X PUT http://localhost:8000/tasks/1 \
   -H "Content-Type: application/json" \
   -d '{"titulo":"Aprender curl avanzado","completada":true}'
   ```

4. Eliminar una tarea (DELETE):

   ```
   curl -X DELETE http://localhost:8000/tasks/1
   ```

   Nota: Para todas las rutas que requieren un id, reemplaza 1 por el ID de la tarea que deseas modificar o eliminar.
