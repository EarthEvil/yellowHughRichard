var winston = require('winston'),
    WinstonCloudwatch = require('./winston-cloudwatch.js'),
    crypto = require('crypto');


// Give ourselves a randomized (time-based) hash to append to our stream name
// so multiple instances of the server running don't log to the same
// date-separated stream.
var startTime = new Date().toISOString();

winston.loggers.add('access-log', {
    transports: [
        new winston.transports.Console({
            // json: true,
            prettyPrint: true,
            colorize: true,
            timestamp: true,
            test: "hah",
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
            awsAccessKeyId: 'AKIAIFNUSIVJ5P6ZXYIA',
            awsSecretKey: '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',
            awsRegion: 'us-east-1',
            jsonMessage: true
        })
    ]
});
var logger = winston.loggers.get('access-log');

// var logger = new(winston.Logger)({
//     levels: {
//         trace: 0,
//         input: 1,
//         verbose: 2,
//         prompt: 3,
//         debug: 4,
//         info: 5,
//         data: 6,
//         help: 7,
//         warn: 8,
//         error: 9
//     },
//     colors: {
//         trace: 'magenta',
//         input: 'grey',
//         verbose: 'cyan',
//         prompt: 'grey',
//         debug: 'blue',
//         info: 'green',
//         data: 'grey',
//         help: 'cyan',
//         warn: 'yellow',
//         error: 'red'
//     }
// });

// logger.add(winston.transports.Console, {
//     prettyPrint: true,
//     colorize: true,
//     silent: false,
//     timestamp: true
// });
module.exports = logger;
