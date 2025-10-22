# 1. ORM y Sequelize

### ¿Qué es un ORM? Explicar por qué utilizar un ORM en lugar de escribir consultas SQL manualmente

ORM quiere decir 'Object-Relational Mapping' o Mapeo relacional de objetos y es una técnica de sotware que permite mapear objetos de un lenguaje de programación orientado a objetos con tablas de una base de datos relacional. Un ORM hace las consultas básicas CRUD a través de sus métodos y transforma la información obtenida en objetos de programación, abstrayendo la interacción entre la base de datos y el código de nuestra aplicación, lo que nos evita escribir consultas SQL manualmente.

### Ventajas y desventajas de usar un ORM

- Ventajas:

1.  Abstracción de SQL: Permite trabajar con objetos en lugar de consultas.

2.  Seguridad: Disminuye riesgos de SQL Injection.

3.  Productividad: Menos código y más rápido desarrollo.

4.  Portabilidad: Facilita cambiar el motor de base de datos sin modificar gran parte del código.

- Desventajas:

1.  Rendimiento: Puede ser más lento que SQL optimizado en aplicaciones de alta demanda.

2.  Curva de aprendizaje: Aprender un ORM puede tomar tiempo, especialmente en proyectos grandes.

### ¿Qué es un modelo en el contexto de un ORM como Sequelize?

En Sequelize, un modelo es una clase de Javascript que describe como se almacenarán los registros de una tabla en una base de datos, incluyendo: los atributos o columnas de la tabla, las validaciones y restricciones de los datos, los métodos para manipular estos datos y las relaciones con otros modelos.

### ¿Qué son las relaciones entre modelos y cómo se gestionan en Sequelize?

Las relaciones entre modelos son las conexiones, correspondencias y dependencias entre registros de distintas tablas en una base de datos, lo que nos permite manipular esos registros sin alterar la integridad referencial. Estas relaciones en Sequelize siguen el mismo patrón que las relaciones entre tablas de una base de datos relacional, pudiendo ser:

- Uno a uno: hasOne, belongsTo.

- Uno a muchos: hasMany, belongsTo.

- Muchos a muchos: belongsToMany.

# 2. Configuración Sequelize, definición de modelo Producto y operaciones CRUD

- Configuración Sequelize:

1.  Instalamos e importamos los módulos de Node.js: Sequelize, pg, pg-hstore (no es obligatorio, depende del tipo de dato con el que se trabaje) y dotenv.

2.  Creamos una base de datos en PostgreSQL (o nuestro RDBMS de preferencia).

3.  Creamos una instancia de Sequelize usando 'new Sequelize' e ingresamos las variables de entorno para conectar la aplicación a la base de datos: DB_NAME, DB_USER, DB_PASSWORD, DB_HOST Y DB_DIALECT. Estas variables se definieron en un archivo .env para mantener la configuración segura.

4.  Verificamos la conexión a la base de datos con sequelize.authenticate().

- Definición de modelo Producto:

1.  Importamos Sequelize y Datatypes desde Sequelize, para poder crear nuestro modelo y definir los tipos de datos.

2.  Usamos el método define() de Sequelize, nombramos el modelo y sus atributos (columnas de la tabla) y definimos los tipos de datos y restricciones. Nombre y descripción son datos tipo 'string', precio es tipo 'float', lo que nos permite usar decimales, cantidad e id son datos tipo 'integer' para usar números enteros. Nombre, cantidad y precio no pueden ser valores vacíos (allowNull: false), cantidad tiene por defecto un valor de cero si no se ingresa información (defaultValue: 0), id es una clave primaria autoincremental (primaryKey: true, autoIncrement: true).

- Operaciones CRUD:

1.  Create: para crear un nuevo registro, validamos que los parámetros pasados sean correctos y que no haya valores vacíos. Usamos el método create() de Sequelize para insertar un nuevo registro en la base de datos con los parámetros ingresados.

2.  Read: usamos el método findAll() para obtener todos los productos de la DB, validando que la base de datos no esté vacía antes de mostrar los resultados en consola. Usamos el método findByPk() para obtener un producto específico por su ID, validando que el ID ingresado exista antes de mostrar el resultado en consola.

3.  Update: usamos el método update() para actualizar un registro con la nueva información ingresada como parámetro de la función, según el ID ingresado. Validamos que el ID exista antes de mostrar la información actualizada en consola.

4.  Delete: usamos el método destroy() para eliminar un registro de la DB, según el ID ingresado. Validamos que el ID exista y que se haya eliminado un registro antes de mostrar un mensaje de confirmación en consola.

Envolvimos cada una de las funciones CRUD en un bloque try-catch para un correcto manejo de errores y, en el caso de errores de validación, retornamos un mensaje con throw new Error para que sea capturado en el bloque catch.

- Sincronización de nuestros modelos con la base de datos:

1. Creamos una función principal main() donde usamos sequelize.sync() para sincronizar nuestros modelos con la base de datos.

2. Dentro de esta función principal podemos ejecutar las funciones CRUD para manipular la base de datos.
