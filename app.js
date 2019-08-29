require('./config/config');

// Importaciones de librerías
var express = require('express');
var mongoose = require('mongoose');

// Inicializar variables
var app = express();

// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/app-deportiva-masqueplus', (err, res) => {
    if(err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

// Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'La petición realizada correctamente'
    });
});

// Escuchar petición
app.listen(process.env.PORT, () => {
    console.log('Servidor levantado en el puerto ' + process.env.PORT + ': \x1b[32m%s\x1b[0m', 'online');
});