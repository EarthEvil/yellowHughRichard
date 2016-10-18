// app/routes.js
module.exports = function(app, passport, mysqlConnection) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.html'); // load the index.html file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.html', { message: req.flash('loginMessage') }); 
    });

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.html', { message: req.flash('signupMessage') });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.html', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};


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
    var query = 'select * from transaction where account_id =' + req.params.account_id;
    mysqlConnection.query(query, function(err, rows, fields) {
        console.log(req.ip + "request query: " + query);
        if (!err) {
            res.send(rows);

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

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}