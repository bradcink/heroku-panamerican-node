// Dependencies
// -----------------------------------------------------
var express         = require('express');
var mongoose        = require('mongoose');
var port            = process.env.PORT || 8080;
var passport        = require('passport');
var flash           = require('connect-flash');
var path            = require('path');


var morgan          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var session         = require('express-session');

var configDB        = require('./config/database.js');

var methodOverride  = require('method-override');
var app             = express();
var Post            = require('./api/models/postModel');

// Express Configuration
// -----------------------------------------------------

// Logging and Parsing
app.set('views', path.join(__dirname, './public/views'));
app.use(express.static(__dirname + '/public'));                 // sets the static files location to public
app.use('/bower_components',  express.static(__dirname + '/bower_components')); // Use BowerComponents
app.use(morgan('dev'));                                         // log with Morgan
app.use(cookieParser());                                        // read cookies (needed for auth)
app.use(bodyParser.json());                                     // parse application/json
app.set('view engine', 'ejs');                                  // set up ejs for templating
app.use(bodyParser.urlencoded({extended: true}));               // parse application/x-www-form-urlencoded
app.use(bodyParser.text());                                     // allows bodyParser to look at raw text
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));  // parse application/vnd.api+json as json
app.use(methodOverride());

// Passport (required)
require('./config/passport')(passport);                         // pass passport for configuration
app.use(session({ secret: 'panamerican voyage' }));             // session secret
app.use(passport.initialize());
app.use(passport.session());                                    // persistent login sessions
app.use(flash());                                               // use connect-flash for flash messages stored in session

// Routes
// ------------------------------------------------------
var routes = require('./api/routes/appRoutes.js');
routes(app, passport);

// Listen
// -------------------------------------------------------
app.listen(port);
console.log('App listening on port ' + port);
