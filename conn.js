var mysql = require('mysql');
var util = require("util");
var conn = mysql.createConnection({
    host:'bspvnmf2hugrrwx7trvq-mysql.services.clever-cloud.com',
    user:'ujlgcrmygsx7jreo',
    password:"4iLgaAluf62yzOrrOuCr",
    database:"bspvnmf2hugrrwx7trvq"
});

var exe = util.promisify(conn.query).bind(conn);

module.exports = exe;
