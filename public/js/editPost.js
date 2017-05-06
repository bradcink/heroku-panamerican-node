var updateObject = req.body; // {last_name : "smith", age: 44}
var id = req.params.id;
var editPost = Post.update({_id  : ObjectId(id)}, {$set: updateObject});

// New User is saved in the db.
editPost.exec(function(err){
    if(err)
        res.send(err);

    // If no errors are found, it responds with a JSON of the new user
    res.json(req.body);
});
