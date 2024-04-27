const EmailSender = require('.././middleware/EmailSender');
const emailSender = new EmailSender();
const express = require('express');
const router = express.Router();

// Endpoint para enviar correo electrónico
router.post('/recuperar-pass', async (req, res) => {
  try {
    const { email } = req.body;

    // Enviar el correo electrónico utilizando la instancia de EmailSender
    const resetToken = await emailSender.sendPasswordResetEmail(email);

    res.json({
      success: true,
      message: 'Correo electrónico enviado correctamente',
      resetToken,
    });
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
    res.status(500).json({
      success: false,
      message: 'Error al enviar el correo electrónico',
    });
  }
});

module.exports = router;