const { response } = require("express");
const bcrypt = require("bcryptjs");        //Para encriptar la contraseña del usuario
const { validationResult } = require("express-validator");

const Evento = require('../models/Evento');

const getEventos = async (req, res=response) => {

    const eventos = await Evento.find()
                                .populate('user', 'name') //Rellenamos los datos del usuario (los datos son traidos desde la base de datos)... //*.populate(<parametro a llenar>, <datos que queremos traer y mostrar>)

    res.json({
        ok: true,
        eventos
    });
}

const crearEvento = async  (req, res=express.response) => {

    const evento = new Evento( req.body );

    try {

        evento.user = req.uid;

        //Guardar el evento en base de datos:
        const eventoGuardado = await evento.save();

        res.json({
            ok: true,
            msg: eventoGuardado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contacte al Desarrollador.'
        })
    }
}

const actualizarEvento = async (req, res=response) => {
    
    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        
        const evento = await Evento.findById( eventoId );
        if( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id.'
            });
        }
        //Verificar que el usuario es el autenticado:
        if( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permiso de editar este evento.'
            });
        }
        //Si el usuario si es el autenticado:
        const nuevoEvento = {
            ...req.body,
            user: uid
        }
        const eventoAcutalizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } );  //usamos { new: true } para indicaar a la funcion que retorne los datos actualizados
        res.json({
            ok: true,
            evento: eventoAcutalizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contacte al Desarrollador.'
        })
    }
}

const eliminarEvento = async (req, res=response) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        
        const evento = await Evento.findById( eventoId );
        if( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id.'
            });
        }
        //Verificar que el usuario es el autenticado:
        if( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permiso para eliminar este evento.'
            });
        }
        //Si el usuario si es el autenticado:
        await Evento.findByIdAndDelete( eventoId );  
        res.json({
            ok: true,
            msg: 'Evento Eliminado.'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Contacte al Desarrollador.'
        })
    }
}

module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}