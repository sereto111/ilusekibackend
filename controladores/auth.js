const {response} = require('express')
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10)
const Usuario = require('../modelos/Usuario')

const registrar = async (req, res = response) => {
    const {nombre, email, password} = req.body
   
    try { 
            let usuario = await Usuario.findOne({ email })
            if ( usuario ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'usuario ya existe en la BD'
                })
            }
            usuario = new Usuario(req.body)
            usuario.password = bcrypt.hashSync(password, salt)
            await usuario.save();
            return res.json({
            ok:true,
            mensaje: "registro",
            nombre: usuario.nombre,
            email: usuario.email,
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            mensaje: 'error en el servidor'
        })
    }
}

const loguear = async (req, res = response) => {
    const { email, password } = req.body;
    try {
      let usuario = await Usuario.findOne({ email });
      if (!usuario) {
        return res.status(400).json({
          ok: false,
          mensaje: 'usuario no existe en la BD',
        });
      }
      const passwordMatch = await bcrypt.compare(password, usuario.password);
      if (!passwordMatch) {
        return res.status(400).json({
          ok: false,
          mensaje: 'credenciales erróneas',
        });
      }
      return res.json({
        ok: true,
        mensaje: 'login',
        nombre: usuario.nombre,
        email,
        id: usuario.id,
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        mensaje: 'error en el servidor',
      });
    }
  };

module.exports = {
    registrar, loguear
}