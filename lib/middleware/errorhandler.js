(function() {
  var redirectToRefererOrPlace;

  redirectToRefererOrPlace = require('./../utils/redirect');

  module.exports = function(globals) {
    var ExpectedError, ForbiddenError, InvalidArgumentsError, NotFoundError, ValidationError, app, handleBadRequest, handleError, handleExpectedError, handleForbidden, handleInternalError, handleNotAuthorized, handleNotFound, handleValidationError, logger;
    if (!(globals instanceof require('./../globals').instance)) {
      throw new Error("Globals must be informed");
    }
    if (globals.app() == null) {
      throw new Error("App is required");
    }
    logger = globals.component("utils:loggerClass").create(["ERROR_HANDLER"]);
    ValidationError = globals.component("error:ValidationError");
    ForbiddenError = globals.component("error:ForbiddenError");
    NotFoundError = globals.component("error:NotFoundError");
    ExpectedError = globals.component("error:ExpectedError");
    InvalidArgumentsError = globals.component("error:InvalidArgumentsError");
    process.on('uncaughtException', function(err) {
      return logger.error({
        msg: "uncaughtException",
        error: err
      });
    });
    handleError = function(err, req, res, next) {
      logger.warn({
        msg: "Handling error=" + err
      });
      if (((err != null ? err.status : void 0) != null) && ((err != null ? err.status : void 0) === 403)) {
        return handleForbidden(err, req, res, next);
      } else if (((err != null ? err.status : void 0) != null) && (err != null ? err.status : void 0) === 401) {
        return handleNotAuthorized(err, req, res, next);
      } else if (((err != null ? err.status : void 0) != null) && (err != null ? err.status : void 0) === 400) {
        return handleBadRequest(err, req, res, next);
      } else if (err instanceof ValidationError || err instanceof InvalidArgumentsError) {
        return handleValidationError(err, req, res, next);
      } else if (err instanceof ForbiddenError) {
        return handleForbidden(err, req, res, next);
      } else if (err instanceof NotFoundError) {
        return handleNotFound(req, res, next);
      } else if (err instanceof ExpectedError) {
        return handleExpectedError(err, req, res, next);
      } else {
        return handleInternalError(err, req, res, next);
      }
    };
    handleForbidden = function(err, req, res, next) {
      logger.warn({
        message: "Forbidden access on path=" + req.path
      });
      if (req.accepts(['html', 'json']) === 'json') {
        return res.json(403, {
          error: 'Forbidden'
        });
      } else {
        req.flash('error', "forbidden");
        return redirectToRefererOrPlace(req, res, '/');
      }
    };
    handleNotAuthorized = function(err, req, res, next) {
      logger.warn({
        message: "Not Authorized access on path=" + req.path
      });
      if (req.accepts(['html', 'json']) === 'json') {
        return res.json(401, {
          error: 'Not Authorized'
        });
      } else {
        req.flash('error', "notAuthorized");
        return redirectToRefererOrPlace(req, res, '/');
      }
    };
    handleNotFound = function(req, res, next) {
      logger.warn({
        message: "Not Found access on path=" + req.path
      });
      if (req.accepts(['html', 'json']) === 'json') {
        return res.json(404, {
          error: 'Not Found'
        });
      } else {
        req.flash('error', "notFound");
        req.flash('errorMessage', req.__("Página %s não foi encontrado.", req.path));
        return redirectToRefererOrPlace(req, res, '/');
      }
    };
    handleBadRequest = function(err, req, res, next) {
      logger.warn({
        message: "Bad Request access on path=" + req.path
      });
      if (req.accepts(['html', 'json']) === 'json') {
        return res.json(400, {
          error: 'Bad Request'
        });
      } else {
        req.flash('error', "badRequest");
        return redirectToRefererOrPlace(req, res, '/');
      }
    };
    handleValidationError = function(err, req, res, next) {
      if (req.accepts(['html', 'json']) === 'json') {
        return res.json(400, {
          error: 'Validation Error',
          errors: err.errors
        });
      } else {
        req.flash('error', "badRequest");
        req.flash('validationErrors', err.errors);
        return redirectToRefererOrPlace(req, res, '/');
      }
    };
    handleExpectedError = function(err, req, res, next) {
      if (req.accepts(['html', 'json']) === 'json') {
        return res.json(409, {
          error: 'Expected Error',
          message: err.message
        });
      } else {
        req.flash('error', "expectedError");
        req.flash('errorMessage', err.message);
        return redirectToRefererOrPlace(req, res, '/');
      }
    };
    handleInternalError = function(err, req, res, next) {
      logger.error({
        message: "Handling internal error on path=" + req.path,
        error: err.error || err
      });
      if (req.accepts(['html', 'json']) === 'json') {
        return res.json(500, {
          error: 'Internal Error'
        });
      } else {
        req.flash('error', "internalError");
        return redirectToRefererOrPlace(req, res, '/');
      }
    };
    app = globals.app();
    app.use(function(err, req, res, next) {
      return handleError(err, req, res, next);
    });
    app.use(function(req, res, next) {
      return handleNotFound(req, res, next);
    });
    return app;
  };

}).call(this);