var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');

var SEED = require('../config/config').SEED;

var app = express();

var Categoria = require('../models/categoria');
var Usuario = require('../models/usuario');

// ==============================================================
// Obtener todos las categorias
// ==============================================================
app.get('/', (req, res, next) => {
    Categoria.find({})
        .exec(
            (err, categorias) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    categorias: categorias
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

    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar categoria',
                errors: err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La categoria con el ' + id + ' no existe',
                errors: { message: 'No existe una categoria con ese ID' }
            });
        }

        categoria.nombre = body.nombre;
        categoria.slug = body.slug;
        categoria.descripcion = body.descripcion;
        categoria.usuario = req.usuario._id;

        categoria.save((err, categoriaGuardada) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar categoria',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                categoria: categoriaGuardada
            });
        });
    });
});


// ==============================================================
// Crear una nueva categoria
// ==============================================================
app.post('/', mdAutenticacion.verificarToken, (req, res) => {
    var body = req.body;

    var categoria = new Categoria({
        nombre: body.nombre,
        slug: body.slug,
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear la categoria',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            categoria: categoriaGuardada
        });
    });
});

// ==============================================================
// Eliminar usuario por id
// ==============================================================
app.delete('/:id', mdAutenticacion.verificarToken, (req, res) => {
    var id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaEliminada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar la categoria',
                errors: err
            });
        }

        if (!categoriaEliminada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La categoria con el ' + id + ' no existe',
                errors: { message: 'No existe una categoria con ese ID' }
            });
        }

        res.status(200).json({
            ok: true,
            categoria: categoriaEliminada
        });
    });
});

module.exports = app;