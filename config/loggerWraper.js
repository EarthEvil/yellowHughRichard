// wrapper of winson-aws-cloudwatch logger

var winson_logger = require(__dirname + '/logger.js');
var sizeof = require('object-sizeof');
var url = require('url');
const page_request = "page_request"
const api_request = "api_request"
const sql_query = "sql_query"

var logger = {
    test: function() {
        console.log("teestteestteestteestteestteestteestteestteestteestteestteest");
    },
    //page request log
    // format: 
    // {level, timestamp, ip, username, requestType,message, statusCode, responseSize, executetion_time}
    log: function(string) {
        winson_logger.log(string);
    },
    page_log: function(req, res, level, timestamp_i, executetion_time_i) {
        if (typeof req.user === 'undefined') { req.user = { id: "" } };
        winson_logger.log(level, page_request, {
            timestamp: timestamp_i,
            ip: req.ip,
            username: req.user.id,
            sessionID: req.sessionID,
            page: req.path, // http://www.example.com/admin/new  will get /path
            statusCode: res.statusCode,
            // byte: res.headers['Content-length'], // in byte
            executetion_time: executetion_time_i
        });
    },

    // API request log
    // format: {level, type, timestamp, ip, username, requestType, params, executetion_time }
    api_log: function(req, res, level, timestamp_i, api_type, executetion_time_i) {
        winson_logger.log(level, api_request, {
            timestamp: timestamp_i,
            ip: req.ip,
            username: req.user.id,
            sessionID: req.sessionID,
            api: api_type,
            params: JSON.stringify(req.params),
            body: JSON.stringify(req.body),
            statusCode: res.statusCode,
            executetion_time: executetion_time_i
        });
    },

    // sql log
    // format: {level, type, timestamp, ip, username, sql, sql_result, executetion_time }
    sql_log: function(req, level, timestamp_i, sql_i, rows, error, executetion_time_i) {
        winson_logger.log(level, sql_query, {
            timestamp: timestamp_i,
            ip: req.ip,
            username: req.user.id,
            sql: sql_i,
            rows: JSON.stringify(rows),
            error: JSON.stringify(error),
            executetion_time: executetion_time_i
        });
    }
}

module.exports = logger;
