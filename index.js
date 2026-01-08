var express = require('express');
var bodyParser = require('body-parser');
var fileUpload = require('express-fileupload');
var session = require('express-session');
var admin = require('./routes/admin');
var user = require('./routes/user');
var url = require('url');
var app = express();


app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());
app.use(session({
    secret:'pranjal',
    resave:true,
    saveUninitialized:true
    }));

    app.use(express.static('public/'));

    app.use(function(req,res, next)
    {
        var url_data = url.parse(req.url, true).query;
        req.url_data = url_data;
        next();
    });

    app.use('/admin',admin);
    app.use('/',user);


app.listen(1000);