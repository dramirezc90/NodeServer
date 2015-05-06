/**
 * Created by david on 3/20/15.
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
    sequelize = new Sequelize('rest_mysql2', 'root', '', {
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

var restaurante = sequelize.define('Restaurante', {
    idRestaurante: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: Sequelize.STRING,
    calificacion: Sequelize.INTEGER,
    imagen: Sequelize.STRING

})

var cliente = sequelize.define('Cliente', {
    nombre: Sequelize.STRING,
    apellido: Sequelize.STRING,
    cedula: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    correo: Sequelize.STRING,
    pass: Sequelize.STRING
});

var cuenta = sequelize.define('Cuenta', {
    cliente: {
        type: Sequelize.INTEGER,
        references: 'Clientes',
        referencesKey: 'cedula'
    },
    restaurante: {
        type: Sequelize.INTEGER,
        references: 'Restaurantes',
        referencesKey: 'idRestaurante'
    }
});

var ubicacion = sequelize.define('Ubicacion', {
    idUbicacion: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: Sequelize.STRING,
    direccion: Sequelize.STRING,
    lat: Sequelize.FLOAT(10,6),
    longi: Sequelize.FLOAT(10,6),
    idRestaurante: {
        type: Sequelize.INTEGER,
        references: 'Restaurantes',
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
        primaryKey: true,
        autoIncrement: true
    },
    restaurante: {
        type: Sequelize.INTEGER,
        references: 'Restaurantes',
        referencesKey: 'idRestaurante'
    },
    usuario: {
        type: Sequelize.STRING,
        references: 'Usuarios',
        referencesKey: 'correo'
    },
    fecha: Sequelize.DATE,
    calificacion: Sequelize.INTEGER
})

var horario = sequelize.define('Horario', {
    codHorario: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    restaurante: {
        type: Sequelize.INTEGER,
        references: 'Restaurantes',
        referencesKey: 'idRestaurante'
    },
    dia: Sequelize.STRING,
    horaInicio: Sequelize.TIME,
    horaFin: Sequelize.TIME,
})

var comida = sequelize.define('Comidas', {
    idComida: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
        references: 'Restaurantes',
        referencesKey: 'idRestaurante'
    }
})


sequelize.sync()