require('./config/config');

// Importaciones de librerías
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Conexión a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/app-deportiva-masqueplus', (err, res) => {
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');

// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/', appRoutes);

// Escuchar petición
app.listen(process.env.PORT, () => {
    console.log('Servidor levantado en el puerto ' + process.env.PORT + ': \x1b[32m%s\x1b[0m', 'online');
});