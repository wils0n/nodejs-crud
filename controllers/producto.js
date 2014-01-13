// Creación de la Conexión
var mongoose = require('mongoose');
var db_lnk = 'mongodb://localhost/supermercado';
//var db = mongoose.createConnection(db_lnk);
var db = mongoose.connect(db_lnk);

// Creación de variables para cargar el modelo
var producto_schema = require('../models/producto');
var Producto = db.model('Producto', producto_schema);

exports.index = function (req, res, next){
	Producto.find(function (err, productos){
		if(err)
			console.log(err);
		return res.render('index', {title: 'Lista de Productos', productos: productos})
	});
};

exports.show_edit = function(req, res, next){
	var id = req.params.id;
	Producto.findById(id, function(err, producto){
		if (err)
			console.log(err);
		return res.render('show_edit', {title: 'Ver Producto', producto: producto});
	});
};

exports.update = function(req, res, next){
	var id = req.params.id;
	var nombre = req.body.nombre || '';
	var descripcion = req.body.descripcion || '';
	var precio = req.body.precio || '';

	console.log(req.params)
	console.log(req.body)

	if ((nombre =='') || (descripcion == '')){
		console.log('ERROR', 'Campos vacios');
		return res.send('Hay Campos vacíos, revisar');
	}

	if (isNaN(precio)) {
		console.log('ERROR: Precio no es un número');
		return res.send('Precio no es un número');
	}

	Producto.findById(id, function(err, producto){
		if (err){
			console.log(err);
		}

		if(!producto){
			console.log('ERROR: id no existe');
		}else{
			producto.nombre = nombre;
			producto.descripcion = descripcion;
			producto.precio = precio;

			producto.save(function(err){
				if(err)
					console.log(err);
				return res.redirect('/');
			});
		}
	});

};

exports.remove = function(req, res, next){
	var id = req.params.id

	Producto.findById(id, function(err, producto){
		if (err)
			console.log(err);
		if (!producto)
			return res.send("Invalid ID")

		producto.remove(function(err){
			if (err)
				console.log(err);
			return res.redirect("/");
		});
	});
}

exports.create = function(req, res, next){
	if(req.method == 'GET')
		return res.render('show_edit', {title: 'Nuevo producto', producto:{}});
	else if (req.method == 'POST'){
		console.log(req.body);
		var nombre = req.body.nombre || '';
		var descripcion = req.body.descripcion || '';
		var precio = req.body.precio || '';

		if (nombre == '' || descripcion == ''){
			console.log ('ERROR:  Campos vacios');
			return res.send("Hay campos vacios, revisar");
		}

		if (isNaN(precio)){
			console.log('ERROR: Precio no es un numero');
			return res.send("Precio no es un numero");
		}

		var producto = new Producto({
			nombre: nombre,
			descripcion: descripcion,
			precio: precio
		});

		producto.save(function(err){
			if (err){
				console.log(err);
				return  next(err);
			}
			return res.redirect('/');
		});
	}
}