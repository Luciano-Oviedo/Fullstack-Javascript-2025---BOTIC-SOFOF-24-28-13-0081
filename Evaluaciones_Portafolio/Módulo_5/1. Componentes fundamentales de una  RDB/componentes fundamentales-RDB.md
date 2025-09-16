# Componentes fundamentales de una Base de Datos relacional

Los componentes básicos fundamentales de una base de datos relacional son: tablas, atributos, registros y claves (primarias o foráneas).

Una **tabla** es un objeto compuesto de columnas y filas, que nos sirve para almacenar información. Debe tener un nombre único dentro de la base de datos y cada una de sus columnas debe contener un tipo de dato específico.

Las columnas de una tabla representan **atributos**: datos atómicos (únicos y no divisibles), no redundantes con otros atributos.

Las filas de una tabla representan **registros**: los valores asignados a cada atributo.

Las **claves primarias** son identificadores únicos para cada registro en una tabla y sirven de punto de referencia para relacionar estos registros con otras tablas.

Las **claves foráneas** referencian, dentro de una tabla, los registros de otras tablas. Para ello, una clave foránea asume el valor de la clave primaria de la tabla y registro que quiere referenciar.

Es a través de las claves primarias y foráneas que en una base de datos relacional podemos relacionar la información de múltiples tablas entre sí, evitando crear una sola tabla sobrecargada de información y garantizando la integridad referencial.
