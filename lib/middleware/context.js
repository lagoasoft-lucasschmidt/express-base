(function() {
  var _this = this;

  module.exports = function(globals) {
    var app;
    if (!(globals instanceof require('./../globals').instance)) {
      throw new Error("Globals must be informed of type Globals or undefined");
    }
    app = globals.app();
    app.use(function(req, res, next) {
      var _ref, _ref1;
      if (res.locals.ctx != null) {
        return next();
      }
      res.locals.ctx = {};
      if (((_ref = req.session) != null ? _ref.id : void 0) != null) {
        res.locals.ctx.sessionid = req.session.id;
      }
      if (res.locals.user != null) {
        res.locals.ctx.user = res.locals.user;
      }
      if (res.locals.hasUserLoggedIn != null) {
        res.locals.ctx.hasUserLoggedIn = res.locals.hasUserLoggedIn;
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
      if ((_ref1 = req.locals) != null ? _ref1.ctx : void 0) {
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
