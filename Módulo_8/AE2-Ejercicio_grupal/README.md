# Ejercicio grupal AE2 - Módulo 8 - Sala 3

### Explicar brevemente los distintos rangos de códigos HTTP

- 1XX: los códigos en rango 100 son informativos.

- 2XX: los códigos en rango 200 son para operaciones exitosas.

- 3XX: los códigos en rango 300 indican redirecciones.

- 4XX: los códigos en rango 400 indican errores del cliente.

- 5XX: los códigos en rango 500 indican errores del servidor.

### ¿En qué casos se utiliza cada tipo de petición HTTP?

- GET: se utiliza para obtener un recurso.
- POST: se utiliza para crear un recurso.
- PUT: se utiliza para actualizar completamente un recurso (usamos PATCH para modificaciones parciales).
- DELETE: se utiliza para eliminar un recurso.

### ¿Cómo debe estructurarse un endpoint según la operación?

Se debe definir un método y la ruta debe apuntar a los recursos afectados por ese método.

### ¿Cuál fue el mayor reto en la creación de este servidor?

Simular un código de error 500 sin usar operaciones asíncronas y persistencia de datos.
