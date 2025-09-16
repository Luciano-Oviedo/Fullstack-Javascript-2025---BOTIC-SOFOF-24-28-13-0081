-- 1. Tabla de tipos de carta

-- PK: id_tipo
--unique: nombre
create table tipo_carta (
    id_tipo serial primary key,
    nombre varchar(15) not null unique
);

-- 2.  Tabla de ediciones

-- PK: id_edicion
-- unique: nombre
create table edicion (
    id_edicion serial primary key,
    nombre varchar(50) not null unique
);

-- 3. Tabla de cartas

-- PK: id_carta
-- FKs: id_tipo -> tipo_carta(id_tipo), id_edicion -> edicion(id_edicion)
-- unique: nombre
-- check: restricciones sobre coste y fuerza
create table cartas (
    id_carta serial primary key,
    id_tipo int not null,
    id_edicion int not null,
    nombre varchar(30) not null unique,
    coste int check (
        (id_tipo = 1 and coste is null) or
        (id_tipo <> 1 and coste > 0)
    ),
    fuerza int check (
        (id_tipo = 2 and fuerza > 0) or
        (id_tipo <> 2 and fuerza is null)
    ),
    descripcion text not null,
    constraint fk_id_tipo foreign key (id_tipo) references tipo_carta(id_tipo),
    constraint fk_id_edicion foreign key (id_edicion) references edicion(id_edicion)
);

-- 4. Tabla de precios de cartas

-- PK: id_precios_cartas
-- FK: id_carta -> cartas(id_carta)
-- check: precio > 0
-- on delete cascade: fk_id_carta
create table precios_cartas (
    id_precios_cartas serial primary key,
    id_carta int not null,
    precio numeric(10,0) not null check (precio > 0),
    constraint fk_id_carta foreign key (id_carta) references cartas(id_carta) on delete cascade
);

-- 5. Tabla de carrito de compras

-- PK: id_carrito
-- FK: id_precios_cartas -> precios_cartas(id_precios_cartas) con on delete cascade
-- check: cantidad > 0
--on delete cascade: fk_id_precios_cartas
create table carrito_compras (
    id_carrito serial primary key,
    id_precios_cartas int not null,
    cantidad int not null check (cantidad > 0),
    constraint fk_id_precios_cartas foreign key (id_precios_cartas) references precios_cartas(id_precios_cartas) on delete cascade
);
