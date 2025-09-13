--Tabla productos

create table productos (
	id_producto serial primary key,
	nombre varchar(100) not null unique,
	descripcion text not null,
	precio numeric(10,2) constraint check_mayorQueCero check (precio > 0) not null, 
	cantidad int constraint check_cantidad_positiva check (cantidad >= 0) default 0,
	activo boolean default true
);

--Tabla proveedores

create table proveedores (
	id_proveedor serial primary key,
	nombre varchar(100) not null unique,
	direccion varchar(200) not null unique,
	telefono varchar(20) not null unique,
	email varchar(50) not null unique,
	activo boolean default true
);

--Tabla transacciones

create table transacciones (
    id_transaccion serial primary key,
    tipo_transaccion varchar(10) not null,
    fecha date not null,
    cantidad int constraint check_mayorACero check (cantidad > 0) default 1,
    id_producto int not null,
    id_proveedor int not null,
    constraint fk_id_producto foreign key (id_producto) references productos (id_producto),
    constraint fk_id_proveedor foreign key (id_proveedor) references proveedores (id_proveedor)
);

--Tabla proveedores_producto

create table proveedores_productos (
	id_proveedor int,
	id_producto int,
	constraint pk_proveedor_producto primary key (id_proveedor, id_producto),
	constraint fk_id_proveedor foreign key (id_proveedor) references proveedores (id_proveedor),
	constraint fk_id_producto foreign key (id_producto) references productos (id_producto)
);