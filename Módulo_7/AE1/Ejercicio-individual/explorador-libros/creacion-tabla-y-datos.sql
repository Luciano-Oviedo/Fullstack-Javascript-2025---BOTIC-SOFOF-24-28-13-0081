// Script para creación de tabla
CREATE TABLE libros (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  autor TEXT NOT NULL,
  anio INT
);

// Script datos de ejemplo
INSERT INTO libros (titulo, autor, anio, genero, disponible) VALUES
('Cien años de soledad', 'Gabriel García Márquez', 1967, 'Realismo mágico', true),
('1984', 'George Orwell', 1949, 'Distopía', true),
('El nombre del viento', 'Patrick Rothfuss', 2007, 'Fantasía', true),
('Don Quijote de la Mancha', 'Miguel de Cervantes', 1605, 'Novela clásica', false),
('Fahrenheit 451', 'Ray Bradbury', 1953, 'Ciencia ficción', true),
('Crimen y castigo', 'Fiódor Dostoyevski', 1866, 'Drama psicológico', false),
('El señor de los anillos', 'J.R.R. Tolkien', 1954, 'Fantasía épica', true),
('La sombra del viento', 'Carlos Ruiz Zafón', 2001, 'Misterio', true),
('Los juegos del hambre', 'Suzanne Collins', 2008, 'Distopía', true),
('Orgullo y prejuicio', 'Jane Austen', 1813, 'Romance', true);
