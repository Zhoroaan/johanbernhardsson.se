var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var livereload = require('express-livereload');
var sassMiddleware = require('node-sass-middleware')
var compass = require('node-libcompass');
var bourbon = require('node-bourbon');
var neat = require('node-neat');

var fs = require('fs');

var removeFile = function(path) {
    try {
        fs.unlinkSync(path);
    } catch (err) {
        console.log(path + " not found")
    }
}

// removes the style file because that is not done correctly by the middle where

removeFile("public/stylesheets/mobile.css")
removeFile("public/stylesheets/desktop.css")

var app = express();

var env = process.env.NODE_ENV || 'production'
console.log("process.env.NODE_ENV: " + env)

app.set('env', env)
var routes = require('./routes/blog');
routes.env = env

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

bourbon.with('sass/stylesheets')
neat.with('sass/stylesheets')
compass.with('sass/stylesheets')

app.use(sassMiddleware({
    src: __dirname + '/sass',
    dest: __dirname + '/public',
    debug: true,
    outputStyle: 'nested',
    includePaths: bourbon.includePaths.concat(neat.includePaths).concat(compass.includePaths)
}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.games);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

livereload(app, config = {
    watchDir: process.cwd(),
    exts: ['scss', 'jade', 'css', 'js', 'md'],
    applyJSLive: false
})

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
