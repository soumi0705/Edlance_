//Team-Nuvs
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var rootRoute = require('./root');
var session = require('express-session');
const app = express();
const socket = require('./socket')

app.set('trust proxy', 1) // trust first proxy
app.use(session({
        secret: 'f<7M$@B`',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true }
    }))
    // Define our application

// Set 'port' value to either an environment value PORT or 5000
var port = 5000;
// Router listens on / (root)
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
// Routes
app.use(rootRoute);
var server = app.listen(process.env.PORT || port, () => console.log(`App listening at http://localhost:${port}`))
socket(server)
