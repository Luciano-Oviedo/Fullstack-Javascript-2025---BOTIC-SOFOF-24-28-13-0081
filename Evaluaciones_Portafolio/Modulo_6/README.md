# Evaluación de portafolio - Módulo 6: backend de aplicación web utilizando Node JS y Express JS

## ¿Qué es NPM?

- NPM (Node Package Manager) es el gestor de paquetes oficial de Node.js. NPM permite instalar, actualizar, compartir y administrar paquetes de código reutilizable (módulos), facilitando el desarrollo de aplicaciones en JavaScript.

- Para instalar un paquete con NPM, simplemente hay que ir al directorio de nuestro proyecto desde la terminal y ejecutar el comando:

`npm install nombre_paquete`
Adicionalmente, podemos usar el comando `npm install nombre_paquete --dev` (o, alternativamente a --dev, el atajo: -D) si queremos instalar el paquete como una dependencia de desarrollo, un módulo que sólo es relevante para el proceso de desarrollo, pero que no lo es para los usuarios finales de nuestra aplicación.

## ¿Qué es Express?

Express es un framework de Node.js que nos permite crear servidores web de manera rápida y sencilla, ya que:

- Nos permite definir rutas, que son los caminos por donde los usuarios acceden a nuestra aplicación.
- Nos permite manejar contenido estático, como CSS, imágenes o scripts, para que se puedan mostrar en el navegador.
- Facilita la integración con motores de plantillas para generar contenido dinámico de forma ordenada y reutilizable.

## Configuración del entorno de desarrollo

1. Descargué Node.js desde: https://nodejs.org/es/download, instalé desde el ejecutable y me aseguré de marcar la opción de agregar Node.js al PATH del sistema. NPM viene incluído con la instalación de Node.

2. Cree el directorio para mi proyecto y ahí, cree el archivo principal para mi app: **app.js**.

3. Situado en el directorio de mi proyecto desde la terminal, ejecuté el comando `npm init -y` para inicializar un proyecto con Node.js con parámetros por defecto. Agregué descripción, autor y un script de inicio al archivo autogenerado **package.json**, que contiene los metadatos, scripts y dependencias de mi aplicación.

4. Instalé **Express** con el comando `npm install express`.

5. Instalé **Nodemon** como dependencia de desarrollo con `npm install nodemon -D` y agregué un script a **package.json** para iniciar **app.js** con Nodemon. Nodemon me facilitó el proceso de desarrollo, reiniciando automáticamente el servidor cuando detecte cambios en los archivos.

6. Importé **Express** al archivo principal de mi app usando **require**.

7. Configuré una variable app con: `const app = express();`.

8. Ligué mi servidor al puerto 3000 con:

```
app.listen(3000, () => {
    console.log('mensaje de confirmación de inicio de servidor');
    });
```

9. Finalmente, inicié el servidor con Nodemon con el comando **npm run dev**, ingresé a: `localhost:3000/` desde mi navegador y confirmé la conexión con el mensaje en consola que configuré en el paso anterior.

## Pruebas y puesta en ejecución de la aplicación

Para probar la aplicación, debes:

1. Clonar el repositorio, situarte en el directorio desde la terminal e instalar las dependencias del proyecto con el comando `npm install`.

2. Iniciar el servidor con el comando `npm run start`.

3. Dirigirte a `http://localhost:3000` desde el navegador, ir a la ruta /productos desde el enlace y agregar algún producto mediante el formulario.

4. Actualizar la página con F5 para ver si se muestran los productos agregados antes de recargar, para comprobar la persistencia de datos.
