var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var moment = require('moment');

var mdAutenticacion = require('../middlewares/autenticacion');

var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuario');

// ==============================================================
// Obtener todos los usuarios
// ==============================================================
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre usuario email codigo_postal fecha_nacimiento img role')
        .skip(desde)
        .limit(5)
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        errors: err
                    });
                }

                Usuario.count({}, (err, contador) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            errors: err
                        });
                    }

                    res.status(200).json({
                        ok: true,
                        total: contador,
                        usuarios: usuarios
                    });
                });
            }
        );
});

// ==============================================================
// Actualizar usuario
// ==============================================================
app.put('/:id', mdAutenticacion.verificarToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el ' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            usuarioGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });
        });
    });
});

// ==============================================================
// Crear un nuevo usuario
// ==============================================================
app.post('/', (req, res) => {
    var body = req.body;

    var fecha = new Date();
    var anoActual = fecha.getFullYear();

    var limiteEdad = 14;

    var dia = body.dia;
    var mes = body.mes;
    var ano = body.ano;

    edad = anoActual - ano;

    if (edad <= limiteEdad) {
        res.status(400).json({
            ok: false,
            mensaje: 'No puedes acceder a la plataforma. Solo los usuarios mayores de 14 años pueden acceder.',
            errors: { mensaje: 'No tienes acceso' }
        });
    } else {
        var fecha_nacimiento = dia + '/' + mes + '/' + ano;

        var usuario = new Usuario({
            nombre: body.nombre,
            usuario: body.nombre.toLowerCase().replace(' ', ''),
            email: body.email,
            password: bcrypt.hashSync(body.password),
            img: body.img,
            codigo_postal: body.codigo_postal,
            fecha_nacimiento: fecha_nacimiento,
            role: body.role
        });

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al crear el usuario',
                    errors: err
                });
            }

            res.status(201).json({
                ok: true,
                usuario: usuarioGuardado,
                usuariotoken: req.usuario
            });
        });
    }
});

// ==============================================================
// Eliminar usuario por id
// ==============================================================
app.delete('/:id', mdAutenticacion.verificarToken, (req, res) => {
    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioEliminado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar el usuario',
                errors: err
            });
        }

        if (!usuarioEliminado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el ' + id + ' no existe',
                errors: { message: 'No existe un usuario con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioEliminado
        });
    });
});

module.exports = app;