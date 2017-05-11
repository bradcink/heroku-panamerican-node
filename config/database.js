var mongoose        = require('mongoose');

MONGOLAB_URI        = "mongodb://admin:password@ds127101.mlab.com:27101/mean-panamerican";
// Sets the connection to MongoDB
mongoose.connect(MONGOLAB_URI);
