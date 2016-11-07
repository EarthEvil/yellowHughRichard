var express = require('express');
var app = express();
var port = process.env.PORT || 3001;

app.get('/api/sd')



var server = app.listen(port, function() {
    logger.info("application is running at port: " + port);

});

// properly handle SIGINT 
process.on('SIGINT', function(){
	logger.info("exit program with SIGINT");
	process.exit();
});
