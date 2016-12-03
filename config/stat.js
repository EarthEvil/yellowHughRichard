const os = require('os');

// collect statistic of API server
// API request count
var stat = {
    // page request count:
    login_page_request_count: 0,
    signup_page_request_count: 0,
    index_page_request_count: 0,
    debit_page_request_count: 0,
    deposit_page_request_count: 0,
    location_page_request_count: 0,
    profile_page_request_count: 0,
    login_page_request_per_min: 0,
    signup_page_request_per_min: 0,
    index_page_request_per_min: 0,
    debit_page_request_per_min: 0,
    deposit_page_request_per_min: 0,
    location_page_request_per_min: 0,
    profile_page_request_per_min: 0,

    // API request count
    login_API_requst: 0,
    signup_API_requst: 0,
    debit_API_requst: 0,
    deposit_API_requst: 0,
    transaction_inquire_API_requst: 0,
    create_account_API_requst: 0,
    delete_account_API_requst: 0,
    get_user_profile_API_requst: 0,

    // helper API 
    get_user_id_API_requst: 0,
    get_balance_API_requst: 0,
    insert_transaction_API_requst: 0,
    get_account_info_API_requst: 0,
    get_user_account_API_requst: 0,
    concurrent_connection: 0,

    // Total request
    total_request: stat.login_API_requst + stat.signup_API_requst +
        stat.debit_API_requst + stat.deposit_API_requst + stat.signup_API_requst +
        stat.signup_API_requst + stat.signup_API_requst + stat.transaction_inquire_API_requst +
        stat.create_account_API_requst + stat.delete_account_API_requst + stat.get_user_profile_API_requst,

    // Error Count
    error_request_count: 0,
    error_rate: stat.total_request / error_rate,


    // OS information

    OS_totalmem: os.totalmem(),

    // returns the amount of free system memory in bytes as an integer.
    get_OS_freemem: function() {
        return os.freemem() / (1024 * 1024);
    },

    // The load average is a measure of system activity, calculated by the operating system 
    // and expressed as a fractional number.
    // As a rule of thumb, the load average should ideally be less than 
    // the number of logical CPUs in the system.
    get_OS_loadavg: function() {
        return os.loadavg();
    }
}

module.exports = stat;
