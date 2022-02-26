/*
    Rutas de Usuarios / Events
    host + /api/events
*/
const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-JWT");
const { isDate } = require("../helpers/isDate");
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require("../controllers/events");

const router = Router(); 

//Todas las rutas tienen que pasar por una validación del JWT:
router.use( validarJWT );              //*Se aplica a todas las rutas de abajo ( si existieran rutas arriba, estas no se validarían ).

//Obtener eventos
router.get('/', getEventos);

//Crear un nuevo evento:
router.post(
    '/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        //Evaluamos fechas con una funcionalidad "custom" que recibe de parametro una funcion que valida las fechas:
        check('start', 'Fecha de inicio es obligatoria').custom( isDate ),  
        check('end', 'Fecha de finalización es obligatoria').custom( isDate ),
        validarCampos
    ],
    crearEvento
);

//Actualizar evento:
router.put('/:id', actualizarEvento);

//Borrar evento:
router.delete('/:id', eliminarEvento);

module.exports = router;