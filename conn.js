var mysql = require('mysql');
var util = require("util");
var conn = mysql.createConnection({
    host:'b9u6sr8ecrxvaymrhz4f-mysql.services.clever-cloud.com',
    user:'uthgbycklqwuupy0',
    password:"rwD6wVw8uemCvzhXREpE",
    database:"b9u6sr8ecrxvaymrhz4f"
});

var exe = util.promisify(conn.query).bind(conn);

module.exports = exe;
