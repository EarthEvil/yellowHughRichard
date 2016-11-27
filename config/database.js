// var express = require('express');
require(__dirname + '/env.js');
var mysql = require('mysql');

var mysqlConnection = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DATABASE,
    port: process.env.RDS_PORT
});


mysqlConnection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('database is connected as id ' + mysqlConnection.threadId);
});



module.exports = mysqlConnection;
