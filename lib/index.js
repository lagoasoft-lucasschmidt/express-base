(function() {
  var _,
    _this = this;

  _ = require('underscore');

  module.exports = function(globals) {
    var app, carteroMiddleware, device, express, expressValidator, flash, i18n, logger, options;
    if (!(globals instanceof require('./globals').instance)) {
      throw new Error("Globals must be informed of type Globals or undefined");
    }
    options = globals.options();
    express = options.express;
    app = globals.option("express")();
    if (!globals.app()) {
      globals.app(app);
    }
    logger = globals.option("setupLogger") || function() {};
    if (!_.isFunction(logger)) {
      throw new Error("setupLogger must be a function");
    }
    if (options.port != null) {
      app.port = options.port;
    }
    if (_.isString(options.viewsDir)) {
      logger("Setting viewsDir as " + options.viewsDir);
      app.set('views', options.viewsDir);
    } else {
      logger("Didnt set viewsDir");
    }
    if (options.enableViewCache) {
      logger("Enabling view cache");
      app.enable('view cache');
    }
    if (_.isString(options.viewEngine)) {
      logger("Setting viewEngine as " + options.viewEngine);
      app.set('view engine', options.viewEngine);
    } else {
      logger("Didnt set viewEngine");
    }
    if (options.disableRequestTime !== false) {
      logger("Setting up header that times request");
      app.use(function(req, res, next) {
        var start;
        start = new Date;
        if (res._responseTime) {
          return next();
        }
        res._responseTime = true;
        res.on('header', function(header) {
          var duration;
          duration = new Date - start;
          return res.setHeader('X-Response-Time', duration + 'ms');
        });
        return next();
      });
    } else {
      logger("Did not set up header that times request");
    }
    if (options.requestLogger) {
      logger("Setting up request logger");
      if (options.requestLogger === true) {
        logger("Setting up express.logger");
        app.use(express.logger());
      } else if (_.isFunction(options.requestLogger)) {
        logger("Setting up middleware requestLogger informed");
        app.use(options.requestLogger);
      } else {
        throw new Error("options.requestLogger must be a boolean (default request logger) or a function to be used by express");
      }
    } else {
      logger("Did not set up any request logger");
    }
    if (options.disableCompression !== false) {
      logger("Setting up express.compression");
      app.use(express.compress());
    } else {
      logger("Did not setup express.compression");
    }
    if (options.disableCookies !== false) {
      logger("Setting up cookies support");
      app.use(express.cookieParser(globals.sOption("cookieSecret")));
    } else {
      logger("Did not setup cookies support");
    }
    if (options.disableBodyParser !== false) {
      logger("Setting up body parser, except for file upload");
      app.use(express.json());
      app.use(express.urlencoded());
    } else {
      logger("Did not setup body parser");
    }
    if (options.disableMethodOverride !== false) {
      logger("Setting up method override");
      app.use(express.methodOverride());
    } else {
      logger("Did not setup method override");
    }
    if (options.enableExpressValidator) {
      logger("Setting up support for express-validator into request");
      expressValidator = require('express-validator');
      app.use(expressValidator());
    } else {
      logger("Did not setup express-validator");
    }
    if (options.disableSession !== false) {
      if (options.disableCookies === true) {
        throw new Error("Cookies must be enabled");
      }
      logger("Setting up session support");
      if (_.isObject(options.sessionConfig)) {
        logger("Setting up session support based on config and express.session");
        app.use(express.session(options.sessionConfig));
      } else if (_.isFunction(options.sessionMiddleware)) {
        logger("Setting up session support based on sessionMiddleware informed");
        app.use(options.sessionMiddleware);
      }
    } else {
      logger("Did not set up session");
    }
    if (options.disableFlash !== false) {
      if (options.disableSession === true) {
        throw new Error("Session must be enabled");
      }
      flash = require('connect-flash');
      app.use(flash());
    }
    if (options.disableCsrf !== false) {
      if (options.disableSession === true) {
        throw new Error("Session must be enabled");
      }
      logger("Setting up csrf support");
      app.use(express.csrf());
      app.use(function(req, res, next) {
        res.locals.csrf = req.csrfToken();
        return next();
      });
    } else {
      logger("Did not set up csrf support");
    }
    if (options.disableI18n !== false) {
      logger("Setting up i18n support");
      i18n = require('i18n');
      i18n.configure(globals.oOption("i18nConfig"));
      app.use(i18n.init);
      app.use(function(req, res, next) {
        res.locals.__ = req.__ = res.__ = function() {
          return i18n.__.apply(req, arguments);
        };
        i18n.overrideLocaleFromQuery(req);
        res.cookie(options.i18nConfig.cookie, i18n.getLocale(req));
        res.locals.locale = i18n.getLocale(req);
        res.locals.i18n = i18n.getCatalog(req);
        return next();
      });
    } else {
      logger("Did not setup i18n support");
    }
    if (options.disableDeviceDetection !== false) {
      logger("Setting up express device detection");
      device = require('express-device');
      app.use(device.capture());
      app.use(function(req, res, next) {
        var _ref, _ref1;
        res.locals.device = req.device;
        res.locals.mobile = false;
        if (((_ref = req.device) != null ? _ref.type : void 0) === 'phone' || ((_ref1 = req.device) != null ? _ref1.type : void 0) === 'tablet') {
          res.locals.mobile = true;
        }
        return next();
      });
    } else {
      logger("Did not setup express device detection");
    }
    if (options.disableErrorHandler !== false) {
      logger("Setting up Error Handler necessary middleware");
      if (options.disableFlash === true) {
        throw new Error("Flash must be enable");
      }
      app.use(function(req, res, next) {
        res.locals.validationErrors = req.flash('validationErrors') || null;
        res.locals.errorMessages = req.flash('errorMessage') || null;
        res.locals.errors = req.flash('error') || null;
        res.locals.query = req.query || {};
        return next();
      });
    } else {
      logger("Did not setup integrated error handler necessary middleware");
    }
    if (options.disableUnderscoreOnResponseLocals !== false) {
      logger("Setting up underscore as a local response variable");
      app.use(function(req, res, next) {
        res.locals._ = require('underscore');
        return next();
      });
    } else {
      logger("Did not set up underscore as local response variable");
    }
    if (_.isString(options.carteroDir)) {
      logger("Setting up cartero with dir " + options.carteroDir);
      carteroMiddleware = require("cartero-express-hook");
      app.use(carteroMiddleware(globals.sOption("carteroDir")));
    } else {
      logger("Didnt set up cartero");
    }
    return globals;
  };

}).call(this);
