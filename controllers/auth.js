const express = require("express");
const bcrypt = require("bcryptjs");        //Para encriptar la contraseña del usuario
const { validationResult } = require("express-validator");

const Usuario = require("../models/Usuario");
const { generarJWT } = require("../helpers/jwt");




const crearUsuario = async (req, res = express.response ) => {
    const { name, email, password } = req.body;

    try {
        //Buscar un correo otorgado por body para ve si existe ya en la base de datos:
        let usuario = await Usuario.findOne({ email });  
        
        if( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya ha sido registrado con ese correo.'
            })
        };
        
        usuario = new Usuario( req.body );
        //Encriptar contraseña:
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt);
        //Guardar usuario en base de datos:
        await usuario.save();

        //Generar nuestro JWT (Jason Web Token):
        const token = await generarJWT( usuario.id, usuario.name );

        res.status(201).json({
            ok:true, 
            uid: usuario.id,
            name: usuario.name,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Comuníquese con el desarrollador.'
        });
    }
    
};


const loginUsuario = async (req, res = express.response ) => {
    const { email, password } = req.body;
    
    try {
        //Buscar un correo otorgado por body para ve si existe ya en la base de datos:
        const usuario = await Usuario.findOne({ email });  
        if( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese correo.'
            })
        };
        //Confirmar las contraseñas:
        const validPassword = bcrypt.compareSync( password, usuario.password ); //compara password otorgado por el usuario con el ya alamacenado en la bd.
        if( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida.'
            })
        };
        //Generar nuestro JWT (Jason Web Token):
        const token = await generarJWT( usuario.id, usuario.name );

        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Comuníquese con el desarrollador.'
        });
    }
};

const revalidarToken = async (req, res = express.response ) => {

    const { uid, name } = req;

    //Generar un NUEVO JWT y retornarlo en esta petición:
    const token = await generarJWT( uid, name );

    res.json({
        ok:true, 
        token,
        uid,
        name
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}