'use strict';

module.exports = function(app) {
  var planningPosts = require('../controllers/postController');

  // planningPost Routes
  app.route('/posts')
    .get(planningPosts.list_all_posts)
    .post(planningPosts.create_a_post);

  app.route('/posts/:postId')
    .get(planningPosts.read_a_post)
    .put(planningPosts.update_a_post)
    .delete(planningPosts.delete_a_post);

  app.route('/query')
    .post(planningPosts.query_a_post);

  app.route('/distinct')
    .get(planningPosts.list_distinct_values);
};
