var mysql = require('mysql');
var util = require("util");
var conn = mysql.createConnection({
    host:'bu48mgvbcgai5s68mva4-mysql.services.clever-cloud.com',
    user:'ujerstgnezroejrz',
    password:"9qUXLMfSjw67KoVxEtCQ",
    database:"bu48mgvbcgai5s68mva4"
});

var exe = util.promisify(conn.query).bind(conn);

module.exports = exe;
