/* Para este ejemplo, pensaremos en una base datos que contiene información sobre cartas de un TCG chileno llamado "Mitos y Leyendas". Creamos tres tablas: "cartas", "tipo_carta" y "edicion". la tabla "cartas" referenciará a "tipo_carta" y "edicion" a través de claves foráneas. */

-- Tabla de tipos de carta:

create table tipo_carta (
    id_tipo serial primary key, -- Clave primaria
    nombre varchar(15) not null
);

-- Tabla de ediciones:

create table edicion (
    id_edicion serial primary key, -- Clave primaria
    nombre varchar(50) not null
);

-- Tabla de cartas, con claves foráneas a tipo_carta y edicion:

create table cartas (
    id_carta serial primary key, -- clave primaria
    id_tipo int not null,
    id_edicion int not null,
    nombre varchar(30) not null,
    coste int check (
        (id_tipo = 1 and coste is null) or 
        (id_tipo <> 1 and coste > 0)
    ),
    fuerza int check (
        (id_tipo = 2 and fuerza > 0) or
        (id_tipo <> 2 and fuerza is null)
    ),
    descripcion text not null,
    constraint fk_id_tipo foreign key (id_tipo) references tipo_carta(id_tipo), -- Clave foránea que relaciona el atributo "id_tipo" de esta tabla con la clave primaria del mismo nombre en la tabla "tipo_carta"
    constraint fk_id_edicion foreign key (id_edicion) references edicion(id_edicion) -- Clave foránea que relaciona el atributo "id_edicion" de esta tabla con la clave primaria del mismo nombre en la tabla "edicion"
);

-- Ejemplo de inserción de registros (valores de atributos) para cada tabla:

insert into edicion (nombre) values
('Espada sagrada'),
('Cruzadas'),
('Helénica'),
('Imperio'),
('Hijos de Daana'),
('Tierras Altas'),
('Dominios de Ra'),
('Encrucijada');

insert into tipo_carta (nombre) values
('oro'),
('aliado'),
('talismán'),
('tótem'),
('arma');

insert into cartas (id_tipo, id_edicion, nombre, coste, fuerza, descripcion) values
(1, 5, 'Salmón del Saber', null, null, 'Carta oro que permite barajar una carta y reducir daño.'),
(3, 7, 'Forma de Lince', 2, null, 'Carta talismán que aumenta la fuerza de un aliado.'),
(5, 1, 'Espada larga', 2, null, 'Carta arma que acelera el robo de cartas.'),
(2, 3, 'Fenix', 2, 2, 'Carta aliado que se puede jugar desde el cementerio.'),
(2, 4, 'Julio César', 4, 2, 'Carta aliado única, tus demás aliados ganan 1 a la fuerza y son imbloqueables.'),
(4, 8, 'Esna', 3, null, 'Carta tótem que da robo al jugar aliados.');

