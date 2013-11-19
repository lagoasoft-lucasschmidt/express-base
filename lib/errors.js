(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = function(globals) {
    var ExpectedError, ForbiddenError, InternalError, InvalidArgumentsError, NotFoundError, ValidationError;
    if (!(globals instanceof require('./globals').instance)) {
      throw new Error("Globals must be informed");
    }
    InternalError = (function(_super) {
      __extends(InternalError, _super);

      function InternalError(message, ctx, originalError) {
        this.ctx = ctx;
        this.originalError = originalError;
        InternalError.__super__.constructor.call(this, message);
        this.name = 'Internal Error';
      }

      return InternalError;

    })(Error);
    InvalidArgumentsError = (function(_super) {
      __extends(InvalidArgumentsError, _super);

      function InvalidArgumentsError(message, ctx) {
        this.ctx = ctx;
        InvalidArgumentsError.__super__.constructor.call(this, message);
        this.name = 'Invalid Arguments Error';
      }

      return InvalidArgumentsError;

    })(Error);
    ValidationError = (function(_super) {
      __extends(ValidationError, _super);

      function ValidationError(message, ctx, errors) {
        this.ctx = ctx;
        this.errors = errors;
        ValidationError.__super__.constructor.call(this, message);
        this.name = 'Validation Error';
      }

      return ValidationError;

    })(Error);
    ForbiddenError = (function(_super) {
      __extends(ForbiddenError, _super);

      function ForbiddenError(message, ctx) {
        this.ctx = ctx;
        ForbiddenError.__super__.constructor.call(this, message);
        this.name = 'Forbidden Error';
      }

      return ForbiddenError;

    })(Error);
    NotFoundError = (function(_super) {
      __extends(NotFoundError, _super);

      function NotFoundError(message, ctx) {
        this.ctx = ctx;
        NotFoundError.__super__.constructor.call(this, message);
        this.name = 'Not Found Error';
      }

      return NotFoundError;

    })(Error);
    ExpectedError = (function(_super) {
      __extends(ExpectedError, _super);

      function ExpectedError(message, ctx) {
        this.ctx = ctx;
        ExpectedError.__super__.constructor.call(this, message);
        this.name = 'Expected Error';
        this.message = message;
      }

      return ExpectedError;

    })(Error);
    globals.component("error:InternalError", InternalError);
    globals.component("error:InvalidArgumentsError", InvalidArgumentsError);
    globals.component("error:ValidationError", ValidationError);
    globals.component("error:ForbiddenError", ForbiddenError);
    globals.component("error:NotFoundError", NotFoundError);
    globals.component("error:ExpectedError", ExpectedError);
    return globals;
  };

}).call(this);
