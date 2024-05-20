const { Router } = require('express');
const { validarImagen, subirIlustracion, listarIlustraciones, actualizarIlustracion, eliminarIlustracion, agregarMeGustaIlustracion, deleteMeGustaIlustracion, listarMeGustaIlustracion, agregarGuardados, listarGuardados, eliminarGuardados } = require('../controladores/Ilustracion');
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
    subirIlustracion
);

//TODO: Probar actualizar
router.get("/listarIlustraciones",
    [validarCampos],
    listarIlustraciones
);

//Actualizar por nombre
router.put("/actualizarIlustracion/:nombre",
    [
        check('descripcion', 'la descripcion no puede estar vacía').notEmpty(),
        check('imagen', 'la imagen no puede estar vacía').notEmpty(),
        validarCampos
    ],
    actualizarIlustracion
);

//Eliminar
router.delete("/eliminarIlustracion/:nombre",
    [
        validarCampos
    ],
    eliminarIlustracion
);

//Rutas me gusta
router.post('/me-gusta/:nombre',
    [
        validarCampos
    ],
    agregarMeGustaIlustracion
);

router.post('/eliminar-me-gusta/:nombre',
    [
        validarCampos
    ],
    deleteMeGustaIlustracion
);

router.get('/listar-me-gusta/:usuario',
    [
        validarCampos
    ],
    listarMeGustaIlustracion
);

//Rutas guardados
router.post("/guardados/agregar",
    [
        validarCampos
    ],
    agregarGuardados
);

router.get("/guardados/listar",
    [
        validarCampos
    ],
    listarGuardados
);

router.delete("/guardados/eliminar/:nombre/:propietario",
    [
        validarCampos
    ],
    eliminarGuardados
);

module.exports = router;