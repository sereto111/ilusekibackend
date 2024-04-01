const { Router } = require('express');
const { registrar, loguear } = require('../controladores/auth');
const { check } = require('express-validator')
const { validarCampos } = require('../middleware/validator')
const router = Router();

//ruta raíz
router.get('/', (req, res) =>{
    res.send('Funcionando...')
});

router.post("/registro", 
    [       
        check('nombre', 'el nombre no puede estar vacío').notEmpty(),
        check('email', 'el email debe ser un email válido').isEmail(),
        check('password', 'la contraseña debe tener al menos 8 carácteres').isLength({min : 8}),
        validarCampos
    ], 
registrar);

router.post("/login", 
    [
        check('email', 'el email debe ser válido').isEmail(),
        check('password', 'la contraseña debe tener al menos 8 carácteres').isLength({min : 8}),
        validarCampos
    ], 
loguear);

module.exports = router;