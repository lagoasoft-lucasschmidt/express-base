(function() {
  var _,
    _this = this;

  _ = require('underscore');

  module.exports = function(globals) {
    var app;
    if (!(globals instanceof require('./../globals').instance)) {
      throw new Error("Globals must be informed of type Globals or undefined");
    }
    app = globals.app();
    app.use(function(req, res, next) {
      var _ref, _ref1, _ref2;
      if (res.locals.ctx != null) {
        return next();
      }
      res.locals.ctx = {};
      if (((_ref = req.session) != null ? _ref.id : void 0) != null) {
        res.locals.ctx.sessionid = req.session.id;
      }
      if (req.user != null) {
        res.locals.ctx.user = res.user;
      }
      if (((_ref1 = req.user) != null ? _ref1.role : void 0) != null) {
        res.locals.ctx.role = req.user.role;
      }
      if (_.isFunction(req.isAuthenticated)) {
        res.locals.ctx.hasUserLoggedIn = req.isAuthenticated();
      }
      if (res.locals.locale != null) {
        res.locals.ctx.locale = res.locals.locale;
      }
      res.locals.ctx.path = req.path;
      res.locals.ctx.method = req.method;
      res.locals.ctx.ip = req.ip;
      if (res.locals.device != null) {
        res.locals.ctx.device = req.device;
      }
      if (res.locals.mobile != null) {
        res.locals.ctx.mobile = req.mobile;
      }
      if ((_ref2 = req.locals) != null ? _ref2.ctx : void 0) {
        return next();
      }
      if (req.locals == null) {
        req.locals = {};
      }
      req.locals.ctx = res.locals.ctx;
      return next();
    });
    return globals;
  };

}).call(this);
