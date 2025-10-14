-- Creación base de datos

create database tienda_db;


-- Creación tabla de productos

create table productos (
  id serial primary key,
  nombre text not null,
  precio decimal not null,
  categoria text,
  stock int
);

-- Inserción de datos de prueba

insert into productos (nombre, precio, categoria, stock) values
('Camiseta básica', 7990, 'Ropa', 60),
('Pantalón de mezclilla', 19990, 'Ropa', 35),
('Zapatillas deportivas', 39990, 'Calzado', 25),
('Chaqueta liviana', 24990, 'Ropa', 20),
('Gorro de lana', 5990, 'Accesorios', 50),
('Bufanda de algodón', 6990, 'Accesorios', 45),
('Reloj de pulsera', 34990, 'Accesorios', 18),
('Pulsera de cuero', 9990, 'Accesorios', 40),
('Bolso de mano', 22990, 'Accesorios', 25),
('Mochila escolar', 14990, 'Accesorios', 55),
('Botella de acero inoxidable', 9990, 'Hogar', 60),
('Taza personalizada', 5990, 'Hogar', 70),
('Lámpara de escritorio LED', 15990, 'Hogar', 30),
('Cojín decorativo', 4990, 'Hogar', 40),
('Toalla de baño grande', 7990, 'Hogar', 50),
('Set de vasos de vidrio (6 unidades)', 8990, 'Hogar', 25),
('Cortina de baño', 6990, 'Hogar', 35),
('Reloj de pared', 12990, 'Hogar', 20),
('Alfombra pequeña', 11990, 'Hogar', 22),
('Plancha a vapor', 17990, 'Electrodomésticos', 18),
('Licuadora compacta', 24990, 'Electrodomésticos', 15),
('Tostadora doble', 15990, 'Electrodomésticos', 25),
('Hervidor eléctrico', 13990, 'Electrodomésticos', 40),
('Audífonos Bluetooth', 24990, 'Electrónica', 35),
('Mouse inalámbrico', 9990, 'Electrónica', 30),
('Teclado ergonómico', 19990, 'Electrónica', 20),
('Parlante portátil', 29990, 'Electrónica', 28),
('Cargador USB múltiple', 8990, 'Electrónica', 50),
('Cable HDMI 2m', 4990, 'Electrónica', 80),
('Libro: El principito', 8990, 'Libros', 15),
('Libro: 1984', 9990, 'Libros', 20),
('Libro: Cien años de soledad', 11990, 'Libros', 10),
('Libro: Harry Potter y la piedra filosofal', 10990, 'Libros', 18),
('Cuaderno de notas', 3990, 'Papelería', 60),
('Lápiz tinta azul (pack 10)', 2990, 'Papelería', 80),
('Resaltadores (pack 5)', 4990, 'Papelería', 40),
('Pelota de fútbol', 15990, 'Deportes', 25),
('Raqueta de tenis', 34990, 'Deportes', 10),
('Bicicleta urbana', 159990, 'Deportes', 5),
('Guantes deportivos', 6990, 'Deportes', 30),
('Set de mancuernas 5kg', 24990, 'Deportes', 12),
('Pelota antiestrés', 2990, 'Juguetes', 60),
('Muñeca clásica', 9990, 'Juguetes', 20),
('Auto a control remoto', 19990, 'Juguetes', 15),
('Rompecabezas 1000 piezas', 12990, 'Juguetes', 25),
('Juego de mesa: Ajedrez', 14990, 'Juguetes', 18),
('Galletas de avena 200g', 2490, 'Alimentos', 100),
('Café molido 500g', 6490, 'Alimentos', 60),
('Té verde en bolsas (20u)', 3490, 'Alimentos', 80),
('Chocolate negro 100g', 2990, 'Alimentos', 90),
('Cereal integral 400g', 4990, 'Alimentos', 50);

