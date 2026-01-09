var mysql = require('mysql');
var util = require("util");
var conn = mysql.createConnection({
    host:'bc5wo0gfnqqznrvuvag7-mysql.services.clever-cloud.com',
    user:'urhqxqyaxhsanrr0',
    password:"nM7LRALOL9JeHCufWrux",
    database:"bc5wo0gfnqqznrvuvag7"
});

var exe = util.promisify(conn.query).bind(conn);

module.exports = exe;
