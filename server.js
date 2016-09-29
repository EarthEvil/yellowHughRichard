var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router(); // get an instance of the express Router

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Li123456',
    database: 'bank'
});


mysqlConnection.connect(function(err) {
    if (!err) {
        console.log("database is connected...nn");
    } else {
        console.log(" database error fuck");
    }
});

app.use(express.static('public'));
app.use(favicon(__dirname + '/public/images/favicon/favicon.ico'));

var start = process.hrtime();

var elapsed_time = function(note) {
    var precision = 3; // 3 decimal places
    var elapsed = process.hrtime(start)[1] / 1000000; // divide by a million to get nano to milli
    console.log(process.hrtime(start)[0] + " s, " + elapsed.toFixed(precision) + " ms - " + note + "\n"); // print message + time
    start = process.hrtime(); // reset the timer
}

app.get('/', function(req, res) {
    console.log("hah");
    res.sendFile(__dirname + "/public/" + "index.html");
});

app.get('/customer/:customer_id', function(req, res) {
    var query = 'select * from customer where customer_id = ' + req.params.customer_id;
    mysqlConnection.query(query, function(err, rows, fields) {
        if (!err) {
            res.send(rows);
        } else {
            console.log("qurey error");
        }
    });
});

app.get('/inquire/:account_id', function(req, res) {
    elapsed_time("star inquire");
    var query = 'select * from transaction where account_id =' + req.params.account_id;
    mysqlConnection.query(query, function(err, rows, fields) {
        console.log(req.ip + "request query: " + query);
        if (!err) {
            res.send(rows);
            elapsed_time("end inquire");
            // console.log(rows);

        } else {

            console.log("qurey error");
            console.log("params: " + req.params.account_id);
            console.log(query);
        }
    });
});

app.get('/thoughtputTest/:runs', function(req, res) {
    var query = 'select * from transaction limit 1;';
    elapsed_time("start querying");
    for (var i = 0; i < 1000; i++) {
        mysqlConnection.query(query);
    }
    elapsed_time("start querying");
});

app.get('/balanceinqure/:account_id', function(req, res) {
    elapsed_time("star inquire");

    var query = 'select * from account where account_id =' + req.params.account_id;
    mysqlConnection.query(query, function(err, rows, fields) {
        console.log(req.ip + " request query: " + query);
        if (!err) {
            res.send(rows);
            elapsed_time("end inquire");


        } else {
            console.log("qurey error");
            console.log("params: " + req.params.account_id);
            console.log(query);
        }
    });
});




app.post('/', function(req, res) {
    res.send('POST request to homepage');
});

// HTTP POST 
app.post('/addCustomer', function(req, res) {
    var name = req.body.name;
    var age = req.body.age;
    var address = req.body.address;
    var query = 'insert into customer (name, age, address)  values("' + name + '" , ' + age + ', "' + address + '")';
    mysqlConnection.query(query, function(err, rows, fields) {
        console.log(req.ip + " request query: " + query);
        if (!err) {

        } else {
            console.log("qurey error");
            console.log(query);
        }
    });
    console.log(name, age, address);
    res.send('POST request to homepage');
});

function addTransaction(account_id, transaction_type, amount) {
    var transactionQuery = 'insert into transaction (account_id,transaction_type, amount, time) values (' + account_id + ',  \'' + transaction_type + ' \' , ' + amount + ', ' + 'CURDATE()' + ');';
    // (${account_id},${transaction_type}, ${amount}, CURDATE());';
    mysqlConnection.query(transactionQuery, function(err, rows, fields) {
        if (!err) {
            console.log("EXECUTED: " + transactionQuery);
            elapsed_time("end inquire");

            // 
        } else {
            console.log("ERROR: " + transactionQuery);
        };
    });
}
app.post('/debit', function(req, res) {
    elapsed_time("star inquire");

    var account_id = req.body.account_id;
    var amount = parseInt(req.body.amount);
    // get amount
    var getAmountQuery = 'select balance from account where account_id = ' + account_id;
    mysqlConnection.query(getAmountQuery, function(err, rows, fields) {
        // res.json(rows);
        var currentBalance = parseInt(rows[0].balance);
        var newBalane = currentBalance - amount;
        console.log(currentBalance);
        var updateBalance = 'UPDATE account SET balance=' +
            newBalane + ' WHERE account_id=' +
            account_id + ';'
        mysqlConnection.query(updateBalance, addTransaction(account_id, 'debit', amount));
    });
    res.send('POST request to homepage');
});

app.post('/deposit', function(req, res) {
    elapsed_time("star inquire");

    var account_id = req.body.account_id;
    var amount = parseInt(req.body.amount);
    // get amount
    var getAmountQuery = 'select balance from account where account_id = ' + account_id;
    mysqlConnection.query(getAmountQuery, function(err, rows, fields) {
        // res.json(rows);
        var currentBalance = parseInt(rows[0].balance);
        var newBalane = currentBalance + amount;
        // console.log(currentBalance);
        var updateBalance = 'UPDATE account SET balance=' +
            newBalane + ' WHERE account_id=' +
            account_id + ';'
        mysqlConnection.query(updateBalance, addTransaction(account_id, 'deposit', amount));
    });
    res.send('POST request to homepage');
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('', router);

var server = app.listen(80, function() {
    var host = server.address.address;
    var port = server.address.port;
    console.log("app is listening at http://%s:%s", host, port);

})
