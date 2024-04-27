const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config();
const auth = require('./rutas/auth');
const ilustracion = require('./rutas/Ilustraciones');
const EmailSender = require('./rutas/EmailSender');
const ResetPass = require('./rutas/ResetPass');
const { conexion } = require('./database/config');

//conexion a la BD
conexion()

//creación del servidor
const app = express();

//configurar el middleware cors
app.use(cors());

//permitir escritura y lectura en json
app.use(express.json());

//permitir subida imágenes
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './uploads'
}));

//rutas
app.use('/api/user', auth);
app.use('/api/ilustration', ilustracion);
app.use('/api/correo', EmailSender);
app.use('/api/pass', ResetPass);

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log("El servidor está en el puerto " + PORT);
});