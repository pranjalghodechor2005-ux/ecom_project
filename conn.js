var mysql = require('mysql');
var util = require("util");
var conn = mysql.createConnection({
    host:'b2w3rryd15d7bnm3zar2-mysql.services.clever-cloud.com',
    user:'uyzaatztutnugywh',
    password:"OE6VAu1C2efOzd3jwQAl",
    database:"b2w3rryd15d7bnm3zar2"
});

var exe = util.promisify(conn.query).bind(conn);

module.exports = exe;
