const { Router } = require('express');
const { validarImagen, subirIlustracion, listarIlustracions, actualizarIlustracion, eliminarIlustracion } = require('../controladores/Ilustracion');
const { check } = require('express-validator')
const { validarCampos } = require('../middleware/validator');
const router = Router();

//Comprobación funcionamiento
router.get("/", (req, res) => {
    res.send('Funcionando...')
});

//Crear Ilustracion
router.post("/subirIlustracion", 
    [       
        check('descripcion', 'la descripcion no puede estar vacía').notEmpty(),
        check('imagen').custom(validarImagen),
        validarCampos
    ], 
subirIlustracion);

//TODO:
router.get("/listarIlustracions", 
    [validarCampos],
listarIlustracions);

//Actualizar por titulo
router.put("/actualizarIlustracion/:nombre", 
    [        
        check('descripcion', 'la descripcion no puede estar vacía').notEmpty(),
        check('imagen', 'la imagen no puede estar vacía').notEmpty(),
        validarCampos
    ], 
actualizarIlustracion);

//Eliminar
router.delete("/eliminarIlustracion/:nombre",
    [
        validarCampos
    ],
eliminarIlustracion);

module.exports = router;