-- 1. CREACION DE TABLAS --

-- Tabla clientes --
CREATE TABLE clientes (
    id_cliente SERIAL PRIMARY KEY,
    nombre_cliente VARCHAR(50) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    direccion VARCHAR(100) NOT NULL
);

-- Tabla inventario --
CREATE TABLE inventario (
    id_producto SERIAL PRIMARY KEY,
    nombre_producto VARCHAR(100) UNIQUE NOT NULL,
    precio NUMERIC(10, 2) CONSTRAINT check_precio CHECK (precio > 0) NOT NULL,
    stock INT CONSTRAINT check_stock CHECK (stock > 0) NOT NULL
);

-- Tabla pedidos --
CREATE TABLE pedidos (
    id_pedido SERIAL PRIMARY KEY,
    id_cliente INT NOT NULL,
    fecha DATE NOT NULL,
    CONSTRAINT fk_pedido_cliente FOREIGN KEY (id_cliente)
        REFERENCES clientes (id_cliente)
        ON DELETE CASCADE
);

-- Tabla detalle_pedido (relación N:M) --
CREATE TABLE detalle_pedido (
    id_detalle SERIAL PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT CONSTRAINT check_cantidad CHECK (cantidad > 0) NOT NULL,
    CONSTRAINT fk_detalle_pedido FOREIGN KEY (id_pedido)
        REFERENCES pedidos (id_pedido)
        ON DELETE CASCADE,
    CONSTRAINT fk_detalle_producto FOREIGN KEY (id_producto)
        REFERENCES inventario (id_producto)
        ON DELETE CASCADE
);

-- 2. DATOS DE PRUEBA --

INSERT INTO clientes (nombre_cliente, email, direccion) VALUES
('Carlos Muñoz', 'carlos.munoz@mail.com', 'Av. Los Leones 123'),
('María Pérez', 'maria.perez@mail.com', 'Calle O’Higgins 456'),
('Juan Soto', 'juan.soto@mail.com', 'Pasaje Las Flores 789'),
('Camila Reyes', 'camila.reyes@mail.com', 'Av. Providencia 230'),
('Felipe Rojas', 'felipe.rojas@mail.com', 'Los Pinos 101'),
('Daniela Torres', 'daniela.torres@mail.com', 'Los Alerces 221'),
('Ricardo Morales', 'ricardo.morales@mail.com', 'Av. Matta 320'),
('Antonia López', 'antonia.lopez@mail.com', 'Calle Ñuñoa 880'),
('Jorge Fuentes', 'jorge.fuentes@mail.com', 'Camino El Alba 99'),
('Valentina Díaz', 'valentina.diaz@mail.com', 'Av. Italia 234');

INSERT INTO inventario (nombre_producto, precio, stock) VALUES
('Arroz grano largo 1kg', 1590, 200),
('Aceite vegetal 1L', 2490, 150),
('Azúcar rubia 1kg', 1390, 180),
('Sal fina 1kg', 890, 160),
('Fideos espagueti 500g', 990, 190),
('Salsa de tomate 200g', 690, 100),
('Atún en agua 170g', 1290, 120),
('Leche entera 1L', 1190, 300),
('Pan molde integral 600g', 1890, 90),
('Huevos docena', 3790, 80),
('Cereal de avena 500g', 2990, 75),
('Café instantáneo 170g', 4990, 60),
('Jugo natural 1L', 1990, 85),
('Mantequilla 250g', 2590, 110),
('Queso laminado 200g', 2890, 70),
('Jamón pierna 250g', 3190, 65),
('Chorizo laminado 300g', 3290, 55),
('Yogur frutilla 1L', 1590, 120),
('Detergente polvo 1kg', 2890, 90),
('Papel higiénico 12 unid.', 6990, 50);

INSERT INTO pedidos (id_cliente, fecha) VALUES
(1, '2025-10-10'),
(2, '2025-10-11'),
(3, '2025-10-12'),
(4, '2025-10-13'),
(5, '2025-10-14');

INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad) VALUES
(1, 1, 2), 
(1, 8, 3),     
(2, 2, 5),    
(2, 5, 1),     
(3, 16, 11),    
(4, 10, 6),   
(5, 12, 17),  
(5, 19, 8);       





