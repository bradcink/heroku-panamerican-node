'use strict';

module.exports = function(app, passport) {
  var planningPosts = require('../controllers/postController');

  // planningPost Routes
  app.route('/posts')
    .get(planningPosts.list_all_posts)
    .post(planningPosts.create_a_post);

  app.route('/posts/:postId')
    .get(planningPosts.read_a_post)
    .put(planningPosts.update_a_post)
    .delete(planningPosts.delete_a_post);

  app.route('/search')
    .post(planningPosts.query_a_post);

  app.route('/distinct')
    .get(planningPosts.list_distinct_values);

  //app.route('/', isLoggedIn)
  //  .get(userRoutes.get_homepage);

  app.get('/', isLoggedIn, function(req, res) {
        res.render('index.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });


    // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.get('/login', function(req, res) {

      // render the page and pass in any flash data if it exists
      res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  // app.post('/login', do all our passport stuff here);

  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  app.get('/signup', function(req, res) {

      // render the page and pass in any flash data if it exists
      res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  // app.post('/signup', do all our passport stuff here);

  // =====================================
  // PROFILE SECTION =====================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/profile', isLoggedIn, function(req, res) {
      res.render('profile.ejs', {
          user : req.user // get the user out of session and pass to template
      });
  });

  app.get('/user', isLoggedIn, function(req, res) {
    res.json({
      user : req.user // get the user out of session and pass to template
    });
  });

  app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
      successRedirect : '/profile', // redirect to the secure profile section
      failureRedirect : '/signup', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
  }));

// process the login form
  app.post('/login', passport.authenticate('local-login', {
      successRedirect : '/', // redirect to the index
      failureRedirect : '/login', // redirect back to the signup page if there is an error
      failureFlash : true // allow flash messages
  }));

  // route middleware to make sure a user is logged in
  function isLoggedIn(req, res, next) {

      // if user is authenticated in the session, carry on
      if (req.isAuthenticated())
          return next();

      // if they aren't redirect them to the home page
        res.redirect('/login');
   }

  function retrieveUserData(req, res, next) {

  }

};
