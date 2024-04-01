const express = require('express');
const cors = require('cors');
require('dotenv').config();
const auth = require('./rutas/auth');
const { conexion } = require('./database/config');

//conexion a la BD
conexion()

//creación del servidor
const app = express();

//configurar el middleware cors
app.use(cors());

//permitir escritura y lectura en json
app.use(express.json());

//rutas
app.use('/api/user', auth);

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log("El servidor está en el puerto " + PORT);
});