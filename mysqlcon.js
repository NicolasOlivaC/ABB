var mysql = require('mysql');
var { promisify } = require('util');
var db = require('./keys');

var connection = mysql.createConnection(db);

connection.connect(function(err) {
    if(err){
        console.error('Hubo un error al conectar. Código: ' + err.stack);
        return;
    }
    console.log('Se ha establecido conexión a la base de datos. ID: ' + connection.threadId);
});

connection.query = promisify(connection.query);

module.exports = connection;