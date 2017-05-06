// Dependencies
// -----------------------------------------------------
var express         = require('express');
var mongoose        = require('mongoose');
var port            = process.env.PORT || 8080;
var morgan          = require('morgan');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var app             = express();
var Post            = require('./api/models/postModel');

// Express Configuration
// -----------------------------------------------------
// set the view engine to ejs
app.set('view engine', 'ejs');

// Sets the connection to MongoDB
//mongoose.connect("mongodb://localhost/mean-panamerican");

// Logging and Parsing
app.use(express.static(__dirname + '/public'));                 // sets the static files location to public
app.use('/bower_components',  express.static(__dirname + '/bower_components')); // Use BowerComponents
app.use(morgan('dev'));                                         // log with Morgan
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.urlencoded({extended: true}));               // parse application/x-www-form-urlencoded
app.use(bodyParser.text());                                     // allows bodyParser to look at raw text
app.use(bodyParser.json({ type: 'application/vnd.api+json'}));  // parse application/vnd.api+json as json
app.use(methodOverride());

// Routes
// ------------------------------------------------------

// set the home page route
app.get('/', function(req, res) {

    // ejs render automatically looks in the views folder
    res.render('index');
});

var routes = require('./api/routes/postRoutes.js');
routes(app);

// Listen
// -------------------------------------------------------
app.listen(port);
console.log('App listening on port ' + port);
