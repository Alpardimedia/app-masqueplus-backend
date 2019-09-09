var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: [
        'Administrador',
        'Usuario'
    ],
    messsage: '{VALUES} no es un rol permitido'
}

var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    usuario: { type: String, required: true },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'La contraseña es necesaria'] },
    codigo_postal: { type: Number, required: [true, 'El código postal es necesario'] },
    fecha_nacimiento: { type: String, required: [true, 'La fecha de nacimiento es necesaria'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'Usuario', enum: rolesValidos },
    google: { type: Boolean, required: true, default: false }
});

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });

module.exports = mongoose.model('Usuario', usuarioSchema);