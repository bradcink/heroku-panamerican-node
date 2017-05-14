// Pulls Mongoose dependency for creating schemas
var mongoose    = require('mongoose');
var Schema      = mongoose.Schema;
mongoose.set('debug', true);

// Creates a Planning Schema. This will be the basis of how planning data is stored in the db
var PlanningSchema = new Schema({
    city: {type: String},
    province: {type: String},
    country: {type: String},
    location: {type: [Number]}, // [Long, Lat]
    region: {type: String},
    accommodation: {type: String},
    accommodation_alt: {type: [String]},
    activities: {type: [String]},
    comments: {type: String},
    change_log: {type: String},
    //created_at: {type: Date, default: Date.now},
    //updated_at: {type: Date, default: Date.now}
});

// Sets the created_at parameter equal to the current time
// PlanningSchema.pre('save', function(next){
//    now = new Date();
//    this.updated_at = now;
//    if(!this.created_at) {
//        this.created_at = now
//    }
//    next();
//});

// Indexes this schema in 2dsphere format (critical for running proximity searches)
PlanningSchema.index({location: '2dsphere'});
// Indexes all fields to be searched with full text
//https://code.tutsplus.com/tutorials/full-text-search-in-mongodb--cms-24835
//http://stackoverflow.com/questions/24714166/full-text-search-with-weight-in-mongoose
PlanningSchema.index({"$**":"text"});

// Exports the PlanningSchema for use elsewhere. Sets the MongoDB collection to be used as: "panamerican-planning-posts"
module.exports = mongoose.model('panamerican-planning-posts', PlanningSchema);
