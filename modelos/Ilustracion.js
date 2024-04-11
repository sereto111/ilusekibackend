const { Schema, model } = require('mongoose')

const IlustracionSchema = Schema({
    nombre: {
        type : String,
        require: true,
        unique: true
    },
    descripcion : {
        type : String,
        require: true
    },
    imagen : {        
        type : String,
        require: true
    },
    usuario : {
        type : String,
        require: true
    } //Añadir campo usuario | Subido por:
    //TODO: Añadir campo boolean de 'me gusta'
});

const Ilustracion = model('Ilustracion' , IlustracionSchema);

module.exports = { Ilustracion };