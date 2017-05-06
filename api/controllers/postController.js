'use strict';

// Dependencies
var mongoose        = require('mongoose');
var Post            = require('../models/postModel');

exports.list_all_posts = function(req, res) {
  Post.find({}, function(err, post) {
    if (err)
      res.send(err);
    res.json(post);
  });
};

exports.create_a_post = function(req, res) {
  var new_post = new Post(req.body);
  new_post.save(function(err) {
    if (err)
      res.send(err);
    res.json(req.body);
  });
};

exports.read_a_post = function(req, res) {
  Post.findById(req.params.postId, function(err, post) {
    if (err)
      res.send(err);
    res.json(post);
  });
};

exports.update_a_post = function(req, res) {
  var theId = Post.findById(req.params.postId);
  Post.findOneAndUpdate(theId, req.body, function(err, post) {
    if (err)
      res.send(err);
    res.json(post);
  });
};
exports.delete_a_post = function(req, res) {

  Post.remove({
    _id: req.params.postId
  }, function(err, post) {
    if (err)
      res.send(err);
    res.json({ message: 'Post successfully deleted' });
  });
};

// Retrieves JSON records for all users who meet a certain set of query conditions
exports.query_a_post = function(req, res){
    // Grab all of the query parameters from the body.
    var theKeyword             = req.body.keyword;
    // Opens a generic Mongoose Query. Depending on the post body we will...
    var query = Post.find(
        { $text : { $search : theKeyword } },
        { score : { $meta: "textScore" } }
    )
    .sort({ score : { $meta : 'textScore' } })
    .exec(function(err, filteredPosts) {
        // callback
        if(err)
            res.send(err);

        // If no errors, respond with a JSON of all users that meet the criteria
        res.json(filteredPosts);
    });
};

exports.list_distinct_values = function(req, res) {
  var searchFor = "activities";
  Post.find().distinct(searchFor, function(err, post) {
    if (err)
      res.send(err);
    res.json(post);
  });
};
