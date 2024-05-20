const { Schema, model } = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const IlustracionSchema = Schema({
    nombre: {
        type : String,
        default: () => uuidv4(),
        required: true,
        unique: true
    },
    descripcion : {
        type : String,
        require: true
    },
    imagen : {        
        public_id: {
            type: String,
            required: true
        },
        secure_url: {
            type: String,
            required: true
        }
    },
    usuario : {
        type : String,
        require: true
    },
    likes: [{ 
        type: String 
    }],   
});

const GuardadosSchema = Schema({
    nombre: {
        type : String,
        default: () => uuidv4(),
        required: true,
        unique: true
    },
    descripcion : {
        type : String,
        require: true
    },
    imagen : {        
        public_id: {
            type: String,
            required: true
        },
        secure_url: {
            type: String,
            required: true
        }
    },
    usuario : {
        type : String,
        require: true
    },
    likes: [{ 
        type: String 
    }],
    propietario: {
        type: String,
        required: true
    }
});

const Ilustracion = model('Ilustracion' , IlustracionSchema);

const Guardados = model('Guardados', GuardadosSchema);

module.exports = { Ilustracion, Guardados };