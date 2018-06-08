var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken');
var config = require('./server/config/config');

var app = express();

app.set('port', process.env.PORT || config.port);
app.use(cookieParser());
app.use(morgan('dev'));
app.use(bodyParser.json({limit: config.bodyParserLimit}));
app.use(bodyParser.urlencoded({limit: config.bodyParserLimit, extended: true}));
app.use(express.static('client', {index: "/views/index.html"}));


/*Routes*/
var crypto = require('crypto'),KEY = "fB7m8s",
    SALT = "eRis5Chv";


app.use('/common', require('./server/routes/common').OpenRouter);
//serve index file on refresh + '|' +reqData.city+ '|' +reqData.address+ '|' +reqData.state+ '|' +reqData.zipCode+ '|||||||'
app.use(function (req, res, next) {
    if(!/\/(admin|student|super-admin|common)\//.test(req.url)) {
        res.sendFile(__dirname + '/client/views/index.html');
    } else {
        next();
    }
});

app.use(function (req, res, next) {
    console.log('mid--->',req.url);
    if (/\.(html|js|jpeg|jpg|png|ioc|pdf)/.test(req.url)) {
        next();
    } else if (!req.cookies.token) {
        res.sendStatus(401).json({status: false, message: 'Not Authorized'});
    } else {
        jwt.verify(req.cookies.token, config.jwt.secret, function (err, decoded) {
            if (err) {
                res.sendStatus(401).json({status: false, message: 'Not Authorized'});
            } else {
                req.jwt = decoded;  //{id: user._id, role: user.role, email: user.email}
                next();
            }
        });
    }
});

app.use('/admin', require('./server/routes/admin'));
app.use('/common', require('./server/routes/common').AuthRouter);


//start server
var server = app.listen(app.get('port'), function () {
    console.log('Listening on port ' + server.address().port);
});