var winston = require('winston'),
    WinstonCloudwatch = require('./winston-cloudwatch.js'),
    crypto = require('crypto'),
    CloudWatchTransport = require('winston-aws-cloudwatch');
require(__dirname + '/env.js');

// Give ourselves a randomized (time-based) hash to append to our stream name
// so multiple instances of the server running don't log to the same
// date-separated stream.
var startTime = new Date().toISOString();

winston.loggers.add('access_log', {
    transports: [
        new winston.transports.Console({
            prettyPrint: true,
            colorize: true,
            timestamp: true,
            // json: true,
            levels: { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 },
            colors: {
                verbose: 'cyan',
                debug: 'blue',
                info: 'green',
                warn: 'yellow',
                error: 'red',
                silly: 'white'
            }
        }),
        new WinstonCloudwatch({
            logGroupName: 'Elastic-log-group',
            logStreamName: function() {
                // Spread log streams across dates as the server stays up
                var date = new Date().toISOString().split('T')[0];
                return 'Elastic-server-' + date + '-' +
                    crypto.createHash('md5')
                    .update(startTime)
                    .digest('hex');
            },
            awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
            awsSecretKey: process.env.AWS_SECRET_KEY,
            awsRegion: process.env.AWS_REGION,
            messageFormatter: function(log) {
                return JSON.stringify(log);
            }
        })
    ]
});
var logger = winston.loggers.get('access_log');
module.exports = logger;
// module.exports = winston;
