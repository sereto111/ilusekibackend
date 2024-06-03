const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const Usuario = require('../modelos/Usuario');

class EmailSender {
  constructor() {
    // Configurar el transporte de correo
    this.transporter = nodemailer.createTransport({
      // Configuración del servicio de correo
      service: 'gmail',
      auth: {
        user: 'iluseki.help@gmail.com',
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendPasswordResetEmail(email) {
    try {
      // Verificar si el usuario existe en la base de datos
      const usuario = await Usuario.findOne({ email });
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      // Generar un token único para restablecer la contraseña
      const resetToken = uuidv4();

      // Guardar el token en la base de datos junto con la dirección de correo electrónico
      usuario.resetToken = resetToken;
      usuario.resetTokenExpiry = Date.now() + 3600000; // Válido por 1 hora
      await usuario.save();

      // Enviar el correo electrónico con el enlace para restablecer la contraseña
      await this.transporter.sendMail({
        from: 'iluseki.help@gmail.com',
        to: email,
        subject: 'Restablecimiento de contraseña',
        html: `Haga clic <a href="https://iluseki.netlify.app/reset-pass?token=${resetToken}">aquí</a> para restablecer su contraseña <b>(el enlace caducará en 1h)</b><br/><br/>O cópielo en otra pestaña: https://iluseki.netlify.app/reset-pass?token=${resetToken}`,
      });

      // Devolver el token generado para su uso
      return resetToken;
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
      throw new Error('Error al enviar el correo electrónico');
    }
  }

  async sendContactEmail(name, email, message) {
    try {
      // Enviar el correo electrónico del formulario de contacto
      await this.transporter.sendMail({
        from: email,
        to: 'iluseki.help@gmail.com',
        subject: `Mensaje de contacto de ${name}`,
        html: `
          <p>Has recibido un nuevo mensaje de contacto:</p>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${message}</p>
        `,
      });

      console.log('Correo de contacto enviado con éxito');
    } catch (error) {
      console.error('Error al enviar el correo de contacto:', error);
      throw new Error('Error al enviar el correo de contacto');
    }
  }
}

module.exports = EmailSender;