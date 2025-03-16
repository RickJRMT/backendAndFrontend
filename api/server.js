const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const e = require('express');
const app = express();

app.use(express.json());
app.use(cors());

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '2210', // Recordar que esta es la contraseña que se tiene en la base de datos local, en si nuestra base de datos...
    // password: 'root',
    database: 'tienda_en_linea'
})

// Funcion para la conexion y la reconexion
function conectarBD() {
    conexion.connect((error) => {
        if (error) {
            console.log('Error en la conexion a la Base de Datos', error);
            setTimeout(conectarBD, 200);
        } else {
            console.log('Conexion exitosa a la Base de Datos');
        }
    });

    conexion.on('error', error => {
        if (error.code === 'PROTOCOL_CONNECTION_LOST') {
            conectarBD();
        } else {
            throw error;
        }
    });
}

conectarBD();

/* ------------------------------CRUD-COMPLETO---------------------------- */

// Funcion generica para obtener todos los registros de una tabla especifica
// SELECT * FROM clientes (Ejemplo de consulta)
function obtenerTodos(tabla) {
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT * FROM ${tabla}`, (error, resultados) => {
            if (error) {
                reject(error);
            } else {
                resolve(resultados);
            }
        });
    });
}

// Obtiene un objeto en la tabla por su ID
function obtenerUno(tabla, id) {
    return new Promise((resolve, reject) => {
        conexion.query(`SELECT * FROM ${tabla} WHERE id = ?`, [id], (error, resultado) => {
            if (error) {
                reject(error);
            } else {
                resolve(resultado);
            }
        });
    });
}


// Crea o inserta un nuevo registro en la tabla
function crear(tabla, data) {
    return new Promise((resolve, reject) => {
        conexion.query(`INSERT INTO ${tabla} SET ?`, [data], (error, resultado) => {
            if (error) {
                reject(error);
            } else {
                Object.assign(data, { id: resultado.insertId });
                resolve(data);
            }
        });
    });
}


// Actualiza un registro en la tabla por su ID
function actualizar(tabla, id, data) {
    return new Promise((resolve, reject) => {
        conexion.query(`UPDATE ${tabla} SET ? WHERE id = ?`, [data, id], (error, resultado) => {
            if (error) {
                reject(error);
            } else {
                resolve(resultado);
            }
        });
    });
}


// Elimina un registro en la tabla por su ID
function eliminar(tabla, id) {
    return new Promise((resolve, reject) => {
        conexion.query(`DELETE FROM ${tabla} WHERE id = ?`, [id], (error, resultado) => {
            if (error) {
                reject(error);
            } else {
                resolve(resultado);
            }
        });
    });
}

// Las rutas en Express define como el servidor web responde a las solicitudes HTTP en diferentes URL.
// En este caso se definio un CRUD generico en donde se utilizaran rutas dinamicas basadas en la tabla que el usuario especifique.

// Ruta de inicio
app.get('/', (req, res) => {
    res.send('Ruta INICIO');
});
// Cuando un usuario accede al http://localhost:3000/, "El servcidor responde con el mensaje 'Ruta INICIO'".

// Esta ruta me devuelte todos registros
app.get('/api/:tabla', async (req, res) => {
    try {
        const resultados = await obtenerTodos(req.params.tabla);
        res.send(resultados);
    } catch (error) {
        res.status(500).send(`Error en la consulta: ${error}`);
    }
});

// Esta ruta me devuelte todos registros por su ID
app.get('/api/:tabla/:id', async (req, res) => {
    try {
        const resultado = await obtenerUno(req.params.tabla, req.params.id);
        res.send(resultado);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Esta ruta crea un regristro en la tabla
app.post('/api/:tabla', async (req, res) => {
    try {
        const resultado = await crear(req.params.tabla, req.body);
        res.send(resultado);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Esta ruta actualiza un regristro en la tabla por su ID
app.put('/api/:tabla/:id', async (req, res) => {
    try {
        const resultado = await actualizar(req.params.tabla, req.params.id, req.body);
        res.send(resultado);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Esta ruta elimina un regristro en la tabla por su ID
app.delete('/api/:tabla/:id', async (req, res) => {
    try {
        const resultado = await eliminar(req.params.tabla, req.params.id);
        res.send(resultado);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Puerto de escucha del servidor. Se a realizado o no la conexin a la base de datos. Conexion en el puerto configurada.
const puerto = process.env.PORT || 3000;
app.listen(puerto, () => {
    console.log(`Servidor escuchando en http://localhost:${puerto}`);
});

