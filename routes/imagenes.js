var express = require('express');
var fs = require('fs');

var app = express();

app.get('/:tipo/:nombre/:img', (req, res, next) => {
    var tipo = req.params.tipo;
    var nombre = req.params.nombre;
    var img = req.params.img;

    var path = `./uploads/${tipo}/${nombre}/imagenes/${img}`;

    fs.exists(path, existe => {
        if (!existe) {
            path = './assets/no-avatar.png';
        }

        res.sendfile(path);
    });

});

module.exports = app;