const bcrypt = require('bcryptjs');
const Usuario = require('../modelos/Usuario');
const express = require('express');
const router = express.Router();

router.post('/reset-password/:token', async (req, res) => {
  const { password } = req.body;
  const resetToken = req.params.token;

  try {
    const usuario = await Usuario.findOne({ resetToken });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Token inválido o expirado' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Actualizar la contraseña del usuario en la base de datos
    usuario.password = hashedPassword;
    usuario.resetToken = null;
    usuario.resetTokenExpiry = null;
    await usuario.save();

    return res.status(200).json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: 'Error al cambiar la contraseña' });
  }
});

module.exports = router;