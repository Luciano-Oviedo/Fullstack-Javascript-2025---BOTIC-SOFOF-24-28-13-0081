
-----

# API de Carga y Gestión de Archivos

Este proyecto es una API RESTful simple implementada en **Node.js con Express** para manejar la carga (upload) y la eliminación (delete) de archivos. Incluye funcionalidades avanzadas como **validación** de archivos (tipo y tamaño), **generación de nombres únicos** para evitar colisiones, y **transformación automática de imágenes** (redimensión y conversión a PNG) utilizando la librería `sharp`.

## Tecnologías Utilizadas

  * **Node.js**
  * **Express**
  * **express-fileupload**
  * **sharp** (Para la transformación de imágenes)
  * **chalk** (Para logs en consola)

## Estructura del Proyecto

```
m8_ae3_abpro-sala_3/
├── controllers/
│   ├── delete.controller.js  // Lógica para eliminar archivos
│   └── update.controller.js  // Lógica para subir archivos
├── middlewares/
│   ├── error.middleware.js   // Manejo centralizado de errores
│   └── validacion.middleware.js // Middleware para validar la petición
├── routes/
│   ├── delete.router.js      // Rutas para la eliminación
│   └── upload.router.js      // Rutas para la carga
├── utils/
│   ├── errors.js             // Definición de clases de errores personalizados (400, 404, 413, 415, 500)
│   ├── generarNombreUnico.js // Función recursiva para asegurar un nombre único
│   ├── transformarImagen.js  // Función para redimensionar y convertir imágenes a PNG
│   └── validadores.js        // Lógica de validación de directorio, contenido, extensión y tamaño
├── uploads/                  // Directorio de almacenamiento de archivos (se crea si no existe)
├── package.json
└── server.js                 // Archivo principal del servidor
```

-----

## Instalación y Ejecución

1.  **Clonar el repositorio:**

    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd m8_ae3_abpro-sala_3
    ```

2.  **Instalar dependencias:**

    ```bash
    npm install
    ```

    *Nota: Se necesita **nodemon** como dependencia de desarrollo.*

3.  **Ejecutar el servidor:**

      * Modo Desarrollo (con nodemon):
        ```bash
        npm run dev
        ```
      * Modo Producción:
        ```bash
        npm start
        ```

El servidor se iniciará en `http://localhost:3000`. Al inicio, verifica y crea el directorio `uploads` si es necesario.

-----

## Endpoints de la API

La API expone dos funcionalidades principales: carga de archivos y eliminación de archivos.

### 1\. Cargar Archivos (Upload)

  * **Ruta:** `POST /upload`
  * **Descripción:** Permite la carga de uno o múltiples archivos.
  * **Tipo de Formato:** `multipart/form-data`
  * **Campo de Archivo:** El archivo(s) debe(n) ser enviado(s) bajo el nombre de campo `archivo`.

| Parámetro | Tipo | Descripción |
| :--- | :--- | :--- |
| `archivo` | `File` | Uno o más archivos a subir. **(Requerido)** |

### 2\. Eliminar Archivos (Delete)

  * **Ruta:** `DELETE /delete/:filename`
  * **Descripción:** Elimina un archivo específico del servidor.
  * **Parámetro de Ruta:**
      * `:filename`: El nombre del archivo tal como está guardado en el servidor (ej: `mi_archivo.pdf` o `imagen-1.png`).

-----

## Pruebas de Funcionalidad con Postman

Utilice **Postman** (o herramienta similar) para probar los siguientes casos. Asegúrese de seleccionar el tipo de cuerpo **`form-data`** y usar **`archivo`** como nombre de clave.

### A. Carga Exitosa (Caso Base)

**Request:** `POST http://localhost:3000/upload`

| KEY | VALUE | TYPE |
| :--- | :--- | :--- |
| `archivo` | *(Seleccionar un archivo)* | `File` |

**Respuesta Exitosa (201 Created):**

```json
{
    "mensaje": "Archivos cargados exitosamnete",
    "archivosCargados": [
        {
            "nombreOriginal": "mi_imagen.jpg",
            "nombreServidor": "mi_imagen.png",
            "mimetype": "image/png",
            "size": 150000,
            "transformacionAplicada": "Redimensionado (800px) y convertido a PNG"
        },
        // ... otros archivos
    ]
}
```

> **Nota de Transformación:** Si el archivo es `.jpg`, `.jpeg` o `.png`, se **redimensiona a 800px de ancho** y se **convierte a formato PNG**. Si no es una imagen transformable (ej: `.pdf`, `.txt`), se guarda tal cual.

### B. Prueba de Generación de Nombre Único (Duplicados)

Para probar la lógica de `generarNombreUnico.js`, cargue el mismo archivo **tres veces** con el nombre original `foto.png`.

1.  **1ª Carga:** Se guarda como `foto.png`.
2.  **2ª Carga:** Se detecta la existencia, se guarda como `foto-1.png`.
3.  **3ª Carga:** Se detecta la existencia, se guarda como `foto-2.png`.

### C. Casos Límite: Errores de Validación

El proyecto utiliza un sistema de validación robusto con errores personalizados.

| Error / Prueba | Causa | Resultado (Status Code) | Clase de Error |
| :--- | :--- | :--- | :--- |
| **No se envía archivo** | Dejar el `body` de la petición vacío. | **400 Bad Request** | `ErrorValidacion` |
| **Tamaño Excedido** | Subir un archivo **mayor a 5 MB**. | **413 Payload Too Large** | `ErrorTamañoArchivo` |
| **Extensión No Permitida** | Subir un archivo con una extensión **no listada** (ej: `.exe`, `.zip`). | **415 Unsupported Media Type** | `ErrorExtensionArchivo` |
| **Archivo Inexistente** | Intentar `DELETE /delete/archivo_que_no_existe.txt`. | **404 Not Found** | `ErrorRecursoNoEncontrado` |

**Ejemplo de Respuesta de Error (415):**

```json
{
    "error": {
        "name": "UnsupportedExtension",
        "statusCode": 415,
        "message": "La extensión del archivo 'archivo.exe' no está permitida. Extensiones válidas para el tipo application: .pdf"
    }
}
```

### D. Eliminación Exitosa

**Request:** `DELETE http://localhost:3000/delete/archivo_a_eliminar.png`

**Respuesta Exitosa (200 OK):**

```json
{
    "mensaje": "Archivo archivo_a_eliminar.png, eliminado exitosamente"
}
```

-----