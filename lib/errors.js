(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = function(globals) {
    var AppError, ExpectedError, FatalError, ForbiddenError, HandledInternalError, InternalError, InvalidArgumentsError, NotFoundError, ValidationError, _ref;
    if (!(globals instanceof require('./globals').instance)) {
      throw new Error("Globals must be informed");
    }
    AppError = (function(_super) {
      __extends(AppError, _super);

      function AppError() {
        _ref = AppError.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      return AppError;

    })(Error);
    InternalError = (function(_super) {
      __extends(InternalError, _super);

      function InternalError(message, ctx, originalError) {
        this.ctx = ctx;
        this.originalError = originalError;
        InternalError.__super__.constructor.call(this, message);
        this.name = 'Internal Error';
      }

      return InternalError;

    })(AppError);
    InvalidArgumentsError = (function(_super) {
      __extends(InvalidArgumentsError, _super);

      function InvalidArgumentsError(message, ctx) {
        this.ctx = ctx;
        InvalidArgumentsError.__super__.constructor.call(this, message);
        this.name = 'Invalid Arguments Error';
      }

      return InvalidArgumentsError;

    })(AppError);
    ValidationError = (function(_super) {
      __extends(ValidationError, _super);

      function ValidationError(message, ctx, errors) {
        this.ctx = ctx;
        this.errors = errors;
        ValidationError.__super__.constructor.call(this, message);
        this.name = 'Validation Error';
      }

      return ValidationError;

    })(AppError);
    ForbiddenError = (function(_super) {
      __extends(ForbiddenError, _super);

      function ForbiddenError(message, ctx) {
        this.ctx = ctx;
        ForbiddenError.__super__.constructor.call(this, message);
        this.name = 'Forbidden Error';
      }

      return ForbiddenError;

    })(AppError);
    NotFoundError = (function(_super) {
      __extends(NotFoundError, _super);

      function NotFoundError(message, ctx) {
        this.ctx = ctx;
        NotFoundError.__super__.constructor.call(this, message);
        this.name = 'Not Found Error';
      }

      return NotFoundError;

    })(AppError);
    ExpectedError = (function(_super) {
      __extends(ExpectedError, _super);

      function ExpectedError(message, ctx) {
        this.ctx = ctx;
        ExpectedError.__super__.constructor.call(this, message);
        this.name = 'Expected Error';
        this.message = message;
      }

      return ExpectedError;

    })(AppError);
    FatalError = (function(_super) {
      __extends(FatalError, _super);

      function FatalError(message, ctx, originalError) {
        this.ctx = ctx;
        this.originalError = originalError;
        FatalError.__super__.constructor.call(this, message);
        this.name = 'Fatal Error';
      }

      return FatalError;

    })(AppError);
    HandledInternalError = (function(_super) {
      __extends(HandledInternalError, _super);

      function HandledInternalError(message, ctx, originalError) {
        this.ctx = ctx;
        this.originalError = originalError;
        HandledInternalError.__super__.constructor.call(this, message);
        this.name = 'Handled Internal Error';
      }

      return HandledInternalError;

    })(AppError);
    globals.component("error:AppError", AppError);
    globals.component("error:InternalError", InternalError);
    globals.component("error:InvalidArgumentsError", InvalidArgumentsError);
    globals.component("error:ValidationError", ValidationError);
    globals.component("error:ForbiddenError", ForbiddenError);
    globals.component("error:NotFoundError", NotFoundError);
    globals.component("error:ExpectedError", ExpectedError);
    globals.component("error:FatalError", InternalError);
    globals.component("error:HandledInternalError", HandledInternalError);
    return globals;
  };

}).call(this);
