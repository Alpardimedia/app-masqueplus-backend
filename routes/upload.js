var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');

app.use(fileUpload());

app.put('/:tipo/:nombre/:id/', (req, res, next) => {

    var tipo = req.params.tipo;
    var nombre = req.params.nombre;
    var id = req.params.id;

    // Tipo de colección
    var tiposValidos = [
        'usuarios'
    ];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es válida',
            errors: { message: 'Tipo de colección no es válida' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada.',
            errors: { message: 'Selecciona una imagen.' }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Sólo aceptamos estas extensiones
    var extensionValidas = [
        // Imagenes
        'png', 'jpg', 'gif', 'jpeg',

        // Documentos
        'pdf', 'ppt', 'pps', 'xlsx', 'doc', 'docx',

        // Vídeos
        // 'mp4', 'avi', 'mpeg', 'mpg'
    ];

    if (extensionValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            errors: { message: 'Las extensiones válidas son ' + extensionValidas.join(', ') }
        });
    }

    // Nombre de archivo personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    // Crear directorio
    var directorio1 = `./uploads/${tipo}/${nombre}/documentos/`;
    var directorio2 = `./uploads/${tipo}/${nombre}/imagenes/`;

    fs.existsSync(directorio1) || fs.mkdirSync(directorio1, { recursive: true }, err => {});
    fs.existsSync(directorio2) || fs.mkdirSync(directorio2, { recursive: true }, err => {});

    // Mover el archivo del temporal a un path
    if (extensionValidas.indexOf(extensionArchivo) == 1 || extensionValidas.indexOf(extensionArchivo) == 2 || extensionValidas.indexOf(extensionArchivo) == 3) {
        var path = `./uploads/${tipo}/${nombre}/imagenes/${nombreArchivo}`;
    } else {
        var path = `./uploads/${tipo}/${nombre}/documentos/${nombreArchivo}`;
    }

    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

    })

});

function subirPorTipo(tipo, id, nombreArchivo, res) {
    if (tipo === 'usuarios') {

        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.usuario + '/imagenes/' + usuario.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });

            });
        });

    }
}

module.exports = app;