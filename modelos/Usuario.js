const { Schema, model} = require('mongoose')

const UsuarioSchema = Schema({
    nombre: {
        type : String,
        require: true,
        unique : true
    },
    email : {
        type : String,
        require: true,
        unique : true
    },
    password : {
        type : String,
        require: true
    },
    resetToken: {
      type: String,
      default: null
    },
    resetTokenExpiry: {
      type: Date,
      default: null
    }
})

const Usuario = model('Usuario' , UsuarioSchema);

module.exports = Usuario;