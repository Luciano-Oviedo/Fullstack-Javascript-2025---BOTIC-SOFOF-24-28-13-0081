-- Crear base de datos de cine local
CREATE DATABASE db_cine_piolin;

-- Crear tabla de películas
CREATE TABLE peliculas (
    id serial primary key,
    nombre text UNIQUE NOT NULL,
    sinopsis text NOT NULL,
    precio_boleto numeric CHECK (precio_boleto > 0) NOT NULL,
    disponible boolean NOT NULL
);

-- Insertar registros de prueba
INSERT INTO peliculas (nombre, sinopsis, precio_boleto, disponible) VALUES
('Dune: Parte Dos', 'Paul Atreides une fuerzas con los Fremen para vengar a su familia y cambiar el destino del universo.', 8900, true),
('Joker: Folie à Deux', 'Arthur Fleck vuelve en una historia musical junto a Harley Quinn dentro del caos de Gotham.', 8700, true),
('Deadpool & Wolverine', 'El antihéroe más irreverente se une a Logan en una misión que desafía la lógica del multiverso.', 9200, true),
('Inside Out 2', 'Riley enfrenta nuevas emociones mientras atraviesa la adolescencia y cambios profundos.', 7500, true),
('Beetlejuice Beetlejuice', 'La secuela del clásico de Tim Burton regresa con humor negro y caos sobrenatural.', 8000, true),
('Gladiador II', 'Décadas después, un nuevo guerrero se levanta en la arena del Coliseo romano.', 9500, true),
('Venom: El último baile', 'Eddie Brock y Venom enfrentan su batalla final contra una amenaza intergaláctica.', 8700, true),
('Sonic 3', 'Sonic, Tails y Knuckles se enfrentan a una nueva amenaza que pondrá en riesgo su mundo.', 7200, true),
('Mufasa: El Rey León', 'La historia del ascenso de Mufasa, el legendario rey de la sabana africana.', 8500, true),
('Moana 2', 'Moana vuelve a embarcarse en una nueva aventura a través del océano con viejos y nuevos amigos.', 7800, true),
('The Batman: Parte II', 'Batman enfrenta una nueva ola de crimen y corrupción en Gotham City.', 9400, false),
('Avatar: El Camino del Agua 2', 'Jake y Neytiri protegen a su familia en medio de una guerra por el futuro de Pandora.', 9700, false),
('Super Mario Bros. 2', 'Mario y Luigi regresan para salvar el Reino Champiñón de un nuevo villano.', 7400, true),
('Frozen III', 'Elsa y Anna descubren un antiguo secreto que cambiará su reino para siempre.', 8000, true),
('Oppenheimer (Reestreno IMAX)', 'El físico J. Robert Oppenheimer enfrenta las consecuencias de crear la bomba atómica.', 8800, true),
('The Matrix Resurgence', 'Neo y Trinity deben decidir si su libertad vale el precio de una nueva guerra digital.', 8900, false),
('Spider-Man: Beyond the Spider-Verse', 'Miles Morales continúa su viaje entre universos enfrentando su destino.', 9100, true),
('Kung Fu Panda 4', 'Po regresa con una nueva misión: entrenar al próximo Guerrero Dragón.', 7600, true),
('El Exorcista: Creyentes', 'Una nueva posesión desata el terror y obliga a revivir viejas heridas.', 7800, false),
('Twisters', 'Una científica regresa a la caza de tormentas mientras una nueva generación desafía la naturaleza.', 8300, true);
