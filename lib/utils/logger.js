(function() {
  var colors, moment, winston, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('underscore');

  winston = require('winston');

  moment = require('moment');

  colors = require('colors');

  colors.setTheme({
    path: 'magenta',
    date: 'white',
    tags: 'inverse',
    info: 'green',
    data: 'grey',
    warn: 'yellow',
    warning: 'yellow',
    debug: 'blue',
    error: 'red',
    trace: 'cyan'
  });

  module.exports = function(globals) {
    var CustomConsoleTransport, LoggableObject, logger, _ref;
    if (!(globals instanceof require('./../globals').instance)) {
      throw new Error("Globals must be informed");
    }
    logger = new winston.Logger({
      exitOnError: false
    });
    logger.setLevels(globals.oOption("logLevels"));
    LoggableObject = (function() {
      function LoggableObject(tags) {
        this.tags = tags;
        this.__generateMetadata = __bind(this.__generateMetadata, this);
        this.addTag = __bind(this.addTag, this);
        this.warn = __bind(this.warn, this);
        this.trace = __bind(this.trace, this);
        this.debug = __bind(this.debug, this);
        this.emerg = __bind(this.emerg, this);
        this.error = __bind(this.error, this);
        this.info = __bind(this.info, this);
        this.log = __bind(this.log, this);
        this.pid = process.pid;
        if (_.isString(this.tags)) {
          this.tags = [this.tags];
        } else if (!(_.isArray(this.tags))) {
          this.tags = [];
        }
      }

      LoggableObject.create = function(tags) {
        return new LoggableObject(tags);
      };

      LoggableObject.prototype.log = function(optsOrMessage, level) {
        var message;
        if (_.isString(optsOrMessage)) {
          return logger.log(level, optsOrMessage, this.__generateMetadata({}));
        } else if (_.isObject(optsOrMessage)) {
          message = optsOrMessage.message;
          message = message || optsOrMessage.msg || '';
          return logger.log(level, message, this.__generateMetadata(optsOrMessage));
        }
      };

      LoggableObject.prototype.info = function(optsOrMessage) {
        return this.log(optsOrMessage, 'info');
      };

      LoggableObject.prototype.error = function(optsOrMessage) {
        return this.log(optsOrMessage, 'error');
      };

      LoggableObject.prototype.emerg = function(optsOrMessage) {
        return this.log(optsOrMessage, 'emerg');
      };

      LoggableObject.prototype.debug = function(optsOrMessage) {
        return this.log(optsOrMessage, 'debug');
      };

      LoggableObject.prototype.trace = function(optsOrMessage) {
        return this.log(optsOrMessage, 'trace');
      };

      LoggableObject.prototype.warn = function(optsOrMessage) {
        return this.log(optsOrMessage, 'warning');
      };

      LoggableObject.prototype.addTag = function(ctx, tag) {
        if (ctx && _.isObject(ctx) && _.isString(tag)) {
          if (!((ctx.tags != null) && _.isArray(ctx.tags))) {
            ctx.tags = [];
          }
          ctx.tags.push(tag);
        }
        return ctx;
      };

      LoggableObject.prototype.__generateMetadata = function(optsOrMessage) {
        var opts;
        if (!_.isObject(optsOrMessage)) {
          opts = {};
        } else {
          opts = optsOrMessage.ctx || {};
        }
        opts = _.clone(opts);
        opts.pid = this.pid;
        if (!(_.isArray(opts.tags))) {
          opts.tags = [];
        }
        opts.tags = opts.tags.concat(this.tags);
        if (optsOrMessage.error != null) {
          opts.error = optsOrMessage.error;
        }
        if ((opts.error != null) && (opts.error.stack != null)) {
          opts.stack = opts.error.stack;
        }
        return opts;
      };

      return LoggableObject;

    })();
    CustomConsoleTransport = (function(_super) {
      __extends(CustomConsoleTransport, _super);

      function CustomConsoleTransport() {
        this.log = __bind(this.log, this);
        _ref = CustomConsoleTransport.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      CustomConsoleTransport.prototype.log = function(level, message, meta, callback) {
        var tags, _ref1, _ref2;
        if (_.isString(meta != null ? meta.path : void 0)) {
          console.log("" + (meta != null ? meta.pid : void 0) + " - " + (meta != null ? (_ref1 = meta.path) != null ? _ref1['path'] : void 0 : void 0));
        }
        if (((meta != null ? meta.error : void 0) != null) && meta.error.stack) {
          console.log(("" + (meta != null ? meta.pid : void 0) + " " + meta.error.stack).error);
        }
        tags = '';
        if ((meta != null ? meta.tags : void 0) != null) {
          tags = meta.tags.toString();
        }
        console.log("" + (meta != null ? meta.pid : void 0) + " - " + ((meta != null ? (_ref2 = meta.user) != null ? _ref2.email : void 0 : void 0) || 'anon') + " " + tags['tags'] + " " + (moment().format("MMMM Do YYYY, h:mm:ss a").date) + " - " + level[level] + " - " + message[level]);
        return callback();
      };

      return CustomConsoleTransport;

    })(winston.transports.Console);
    logger.add(CustomConsoleTransport, {
      level: globals.sOption("logLevel")
    });
    return LoggableObject;
  };

}).call(this);
