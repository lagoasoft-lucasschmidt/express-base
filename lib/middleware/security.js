(function() {
  var LocalStrategy, passport;

  passport = require('passport');

  LocalStrategy = require('passport-local').Strategy;

  module.exports = function(globals) {
    var ExpectedError, app, authenticate, doesPasswordMatch, logger, retrieveUserByEmail, retrieveUserById;
    if (!(globals instanceof require('./../globals').instance)) {
      throw new Error("Globals must be informed");
    }
    if (globals.app() == null) {
      throw new Error("App is required");
    }
    app = globals.app();
    logger = globals.iOption("securityLogger", globals.component("utils:loggerClass"));
    retrieveUserByEmail = globals.component("security:user:retrieveUserByEmail");
    retrieveUserById = globals.component("security:user:retrieveUserById");
    doesPasswordMatch = globals.component("security:user:doesPasswordMatch");
    ExpectedError = globals.component("error:ExpectedError");
    authenticate = function(req, res, next, redirect) {
      if (redirect == null) {
        redirect = true;
      }
      logger.debug({
        message: "Trying to authenticate user",
        ctx: res.locals.ctx
      });
      return passport.authenticate('local', {
        session: true
      }, function(err, user, info) {
        logger.trace({
          message: "Received response from trying to authenticate user",
          ctx: res.locals.ctx
        });
        if (err || !user) {
          logger.error({
            message: "Couldnt authenticate user, info=" + info + " and error=" + err + " and user=" + user,
            ctx: res.locals.ctx
          });
          return next(new ExpectedError(req.__("Sorry, but you must be authenticated to access that page!")));
        } else {
          logger.info({
            message: "Didnt find an error, authenticated with user id=" + (user != null ? user.id : void 0) + " and info=" + info,
            ctx: res.locals.ctx
          });
          return req.logIn(user, function(error) {
            if (error) {
              return callback(error);
            }
            if (redirect) {
              return res.redirect('/');
            } else {
              return next();
            }
          });
        }
      });
    };
    globals.component("security:authenticate", function(req, res, next) {
      return authenticate(req, res, next, false)(req, res, next);
    });
    globals.component("security:isAuthenticated", function(req, res, next) {
      if (req.isAuthenticated()) {
        logger.trace({
          message: "User is authenticated"
        });
        return next();
      } else {
        logger.info({
          message: "User is not authenticated"
        });
        return next(new ExpectedError(req.__("Sorry, but you must be authenticated to access that page!")));
      }
    });
    globals.component("security:isNotAuthenticated", function(req, res, next) {
      if (!req.isAuthenticated()) {
        logger.trace({
          message: "User is not authenticated"
        });
        return next();
      } else {
        logger.info({
          message: "User is authenticated, forbidden access to " + req.path
        });
        return next(new ExpectedError(req.__("Sorry, but you cant be authenticated to access that page!")));
      }
    });
    globals.component("security:isAdmin", function(req, res, next) {
      if (req.isAuthenticated() && req.user.role === 'ADMIN') {
        logger.trace({
          message: "User is an admin"
        });
        return next();
      } else {
        logger.info({
          message: "User is not authenticated or is not an admin, forbidden access to " + req.path
        });
        return next(new ExpectedError(req.__("Sorry, but you do not have access to that page!")));
      }
    });
    globals.component("security:hasRole", function(role) {
      return function(req, res, next) {
        if (req.isAuthenticated() && req.user.role === role) {
          logger.trace({
            message: "User has role=" + role
          });
          return next();
        } else {
          logger.info({
            message: "User is not authenticated or is not an " + role + ", forbidden access to " + req.path
          });
          return next(new ExpectedError(req.__("Sorry, but you do not have access to that page!")));
        }
      };
    });
    passport.serializeUser(function(user, done) {
      logger.trace({
        message: "Serializing user with id=" + user.id
      });
      return done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
      logger.trace({
        message: "Deserializing user with id=" + id
      });
      return retrieveUserById(id).then(function(user) {
        return done(null, user);
      }).fail(function(error) {
        return done(error);
      }).done();
    });
    passport.use(new LocalStrategy({
      passReqToCallback: true
    }, function(req, username, password, done) {
      var foundUser;
      logger.trace({
        message: "Trying to authenticate user with username=" + username,
        ctx: req.locals.ctx
      });
      foundUser = null;
      return retrieveUserByEmail(username, req.locals.ctx).then(function(user) {
        if (!user) {
          return null;
        }
        foundUser = user;
        return doesPasswordMatch(user, password, req.locals.ctx);
      }).then(function(result) {
        if (!result) {
          return done(null, null);
        } else {
          return done(null, foundUser);
        }
      }).fail(function(error) {
        return done(error);
      }).done();
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(function(req, res, next) {
      if (req.isAuthenticated()) {
        res.locals.user = req.user;
        res.locals.hasUserLoggedIn = true;
        res.locals.role = req.user.role;
      } else {
        res.locals.hasUserLoggedIn = false;
        res.locals.user = false;
        res.locals.role = null;
      }
      return next();
    });
    return globals;
  };

}).call(this);
