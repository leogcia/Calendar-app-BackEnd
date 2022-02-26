/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-JWT");
const { crearUsuario, loginUsuario, revalidarToken } = require("../controllers/auth");
const router = Router(); 



router.post( 
    '/new', 
    [ //midlewares
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser de seis caracteres').isLength({min:6}),
        validarCampos
    ],
    crearUsuario
);

router.post(
    '/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser de seis caracteres').isLength({min:6}),
        validarCampos
    ],
    loginUsuario
);

router.get('/renew', validarJWT, revalidarToken);


module.exports = router;