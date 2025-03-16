CREATE DATABASE tienda_en_linea;
USE tienda_en_linea;

CREATE TABLE clientes(
	id int primary key auto_increment,
	nombre varchar(225),
	cedula varchar(20),
	telefono varchar(20),
	correo varchar(225),
	estatura decimal(3,2),
	edad int
);

SELECT * FROM clientes;