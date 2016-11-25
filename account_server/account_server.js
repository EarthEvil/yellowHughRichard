var express = require('express')
var app = express()
var mysqlConnection = require(__dirname + '/database.js');
var fs = require('fs');
app.get('/', function(req, res) {
    console.log("log");
    res.send('Hello World!')
})

app.get('/generate_account_number', function (req, res, accountNumber) {
    // read the file
    fs.readFile('./sequence.txt', 'utf8',function(error,data){
        accountNumber = data;
        console.log(accountNumber);
        res.send(accountNumber);
        //change to int and increament
        accountNumber = parseInt(accountNumber);
        accountNumber = accountNumber + 1;
        console.log(accountNumber);
        // clear the file
        fs.truncate('./sequence.txt', 0, function(){
            console.log('sequence.txt has cleared');
        });
        //write the new account number to the file
        fs.writeFile('./sequence.txt',accountNumber, function(err){
            if(err){
                throw err;
            }
            console.log("The file has was saved");
        });
    });
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!')
})
