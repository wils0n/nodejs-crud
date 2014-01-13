var Schema = require('mongoose').Schema

var producto_schema = new Schema({
	nombre: String,
	descripcion: String,
	precio: String
});

//esta linea es vital para poder usarlo fuera de app.js
module.exports = producto_schema; 
