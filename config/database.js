// var express = require('express');
var mysql = require('mysql');

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Li123456',
    database: 'bank'
});


mysqlConnection.connect(function(err) {
    if (!err) {
        console.log("database is connected...");
    } else {
        console.log(" database error fuck");
    }
});

module.exports = mysqlConnection;