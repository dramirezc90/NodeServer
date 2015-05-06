/**
 * Created by david on 3/19/15.
 */

var sys = require("sys"),
    my_http = require("http"),
    path = require("path"),
    url = require("url"),
    filesys = require("fs")
    bp = require('body-parser');

var express = require('express'),
    cors = require('cors'),
    app = express();

app.use(cors());
app.use(bp.urlencoded({ extended: false }))
//app.use(bp.json())
//app.use(express.bodyParser());
//app.use(app.router);

var Sequelize = require('sequelize'),
    sequelize = new Sequelize('rest_mysql', 'root', '', {
        host: 'localhost',
        dialect: "mysql",
        port: 3306
    })

sequelize
    .authenticate()
    .complete(function(err) {
        if(!!err) {
            console.log('Error en la conexion a la base de datos', err)
        } else {
            console.log('Conexion exitosa')
        }
    })

// DEFINICION DE LOS TIPOS DE OBJETOS ORM

var cliente = sequelize.define('Cliente', {
    nombre: Sequelize.STRING,
    apellido: Sequelize.STRING,
    cedula: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    correo: Sequelize.STRING,
    pass: Sequelize.STRING,
    restaurante: {
        type: Sequelize.INTEGER,
        references: 'Restaurante',
        referencesKey: 'idRestaurante'
    }
});

var cuenta = sequelize.define('Cuenta', {
    cliente: {
        type: Sequelize.INTEGER,
        references: 'Cliente',
        referencesKey: 'cedula'
    },
    restaurante: {
        type: Sequelize.INTEGER,
        references: 'Restaurante',
        referencesKey: 'idRestaurante'
    }
});

var restaurante = sequelize.define('Restaurante', {
    idRestaurante: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    nombre: Sequelize.STRING,
    calificacion: Sequelize.INTEGER,
    imagen: Sequelize.STRING

})

var ubicacion = sequelize.define('Ubicacion', {
    idUbicacion: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    nombre: Sequelize.STRING,
    direccion: Sequelize.STRING,
    lat: Sequelize.FLOAT(10,6),
    longi: Sequelize.FLOAT(10,6),
    idRestaurante: {
        type: Sequelize.INTEGER,
        references: 'Restaurante',
        referencesKey: 'idRestaurante'
    }
})

var usuario = sequelize.define('Usuario', {
    correo: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    nombre: Sequelize.STRING,
    apellido: Sequelize.STRING,
    contrasena: Sequelize.STRING
})

var comentario = sequelize.define('Comentarios', {
    idComentario: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    restaurante: {
        type: Sequelize.INTEGER,
        references: 'Restaurante',
        referencesKey: 'idRestaurante'
    },
    usuario: {
        type: Sequelize.STRING,
        references: 'Usuario',
        referencesKey: 'correo'
    },
    fecha: Sequelize.DATE,
    calificacion: Sequelize.INTEGER
})

var horario = sequelize.define('Horario', {
    codHorario: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    restaurante: {
        type: Sequelize.INTEGER,
        references: 'Restaurante',
        referencesKey: 'idRestaurante'
    },
    dia: Sequelize.STRING,
    horaInicio: Sequelize.TIME,
    horaFin: Sequelize.TIME,
})

var comida = sequelize.define('Comidas', {
    idComida: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    categoria: Sequelize.STRING,
    tipo: Sequelize.STRING,
    nombre: Sequelize.STRING
})

var comidaRest = sequelize.define('Comida/Rest', {
    comida: {
        type: Sequelize.INTEGER,
        references: 'Comidas',
        referencesKey: 'idComida'
    },
    restaurante: {
        type: Sequelize.INTEGER,
        references: 'Restaurante',
        referencesKey: 'idRestaurante'
    }
})


// INICIO DE SERVIDOR REST API

app.get('/restaurantes', function(req, res) {

    //sequelize.query('SELECT * FROM Restaurante', {
    //    type: Sequelize.QueryTypes.SELECT
    //})


    sequelize.query('SELECT Restaurante.idRestaurante, Restaurante.imagen, Restaurante.nombre, Restaurante.calificacion, Ubicacion.direccion, ' +
    'Horario.dia, Horario.horaInicio, Horario.horaFin ' +
    'FROM Restaurante JOIN Ubicacion ON (Restaurante.idRestaurante = Ubicacion.idRestaurante) ' +
    'JOIN Horario ON (Restaurante.idRestaurante = Horario.restaurante) GROUP BY nombre ORDER BY calificacion DESC', {
        type: Sequelize.QueryTypes.SELECT
    })

    //sequelize.query('SELECT Restaurante.nombre, Restaurante.calificacion, Ubicacion.direccion, ' +
    //'Horario.dia, Horario.horaInicio, Horario.horaFin ' +
    //'FROM Restaurante JOIN Ubicacion ON (Restaurante.idRestaurante = Ubicacion.idRestaurante) ' +
    //'JOIN Horario ON (Restaurante.idRestaurante = Horario.restaurante) ORDER BY nombre', restaurante, {
    //    type: Sequelize.QueryTypes.SELECT
    //})

        .then(function (r) {
            res.status(200);
            res.send(r);
            console.log(r);
        })
});

app.listen(8080);
console.log('Escuchando en puerto 8080')