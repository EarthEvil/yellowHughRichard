var express = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
        console.log("error fuck");
    }
});

app.use(express.static('public'));

router.route('/customer/:customer_id')
    .get(function(req, res) {
        var query = 'select * from customer where customer_id = ' + req.params.customer_id;
        mysqlConnection.query(query, function(err, rows, fields) {
            if (!err) {
                res.send(rows);
            } else {
                console.log("qurey error");
            }
        })
    });

app.get('/inquire/:account_id', function(req, res) {
    var query = 'select * from transaction where fromaccount =' + req.params.account_id;
    mysqlConnection.query(query, function(err, rows, fields) {
        console.log(req.ip + "request query: " + query);
        if (!err) {
            res.send(rows);
            console.log(rows);

        } else {

            console.log("qurey error");
            console.log("params: " + req.params.account_id);
            console.log(query);
        }
    })
});

app.get('/balanceinqure/:account_id', function(req, res) {
    var query = 'select * from account where account_id =' + req.params.account_id;
    mysqlConnection.query(query, function(err, rows, fields) {
        console.log(req.ip + " request query: " + query);
        if (!err) {
            res.send(rows);
            console.log(rows);

        } else {
            console.log("qurey error");
            console.log("params: " + req.params.account_id);
            console.log(query);
        }
    })
});


app.get('/', function(req, res) {
    res.sendFile(__dirname + "/public" + "index.html");
});

app.post('/', function (req, res) {
  res.send('POST request to homepage');
});


app.post('/addCustomer', function (req, res) {
  res.send('POST request to homepage');
});
// app.get('/customer/:customer_id', function(req, res) {
//     var query = 'select * from customer where customer_id = ' + req.params.customer_id;
//     mysqlConnection.query(query, function(err, rows, fields) {
//         if (!err) {
//             res.send(rows);
//         } else {
//             console.log("qurey error");
//         }
//     })
// });




// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('', router);

var server = app.listen(process.env.PORT || 3000, function() {
    var host = server.address.address;
    var port = server.address.port;
    console.log("app is listening at http://%s:%s", host, port);

})
