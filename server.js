var express = require('express');
var cors = require('cors');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var userRoutes = require('./src/routes/user');
var userApi=require('./src/controller/user');
var commonRoutes = require('./src/routes/common');
var mantraRoutes = require('./src/routes/mantra');
var config = require('./src/config/config');
var authMiddleWare = require('./src/middleware/auth');
var subAdminRoutes = require('./src/routes/subAdmin')

var app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json({limit: config.bodyParserLimit}));
app.use(bodyParser.urlencoded({limit: config.bodyParserLimit, extended: true}));


/* CORS ISSUE */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', "*");

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'x-access-token,authorization,Content-Type,Access-Control-Request-Headers,enctype');

    // Set to true if you need the website to include cookies in  requests
    res.setHeader('Access-Control-Allow-Credentials', true);

    if (req.method === 'OPTIONS') {
        res.status(200);
        res.end();
    }
    else {
        // Pass to next layer of middleware
        next();
    }
});
/* CORS */
app.use('/v1/user', userRoutes.commonRouter);
app.use(authMiddleWare)
app.use('/v1/common',commonRoutes.AuthRouter);
app.use('/v1/mantra',mantraRoutes.AuthRouter);
app.use('/v1/subAdmin',subAdminRoutes.AuthRouter);



app.listen(config.port, function(){
    console.log('working on ' + config.port);
});


module.exports = app;
