const mongoose = require('mongoose');

const conexion = async () => {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log('conectado a la BD')
    } catch (error) {
        console.log(error)
        throw Error('Error en la conexión a la BD')
    }
}

module.exports={ conexion }