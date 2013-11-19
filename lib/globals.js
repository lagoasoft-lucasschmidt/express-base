(function() {
  var Globals, init, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('underscore');

  Globals = (function() {
    function Globals(opts) {
      this.configure = __bind(this.configure, this);
      this.use = __bind(this.use, this);
      this.app = __bind(this.app, this);
      this.components = __bind(this.components, this);
      this.component = __bind(this.component, this);
      this.configs = __bind(this.configs, this);
      this.config = __bind(this.config, this);
      this.options = __bind(this.options, this);
      this.iOption = __bind(this.iOption, this);
      this.oOption = __bind(this.oOption, this);
      this.sOption = __bind(this.sOption, this);
      this.bOption = __bind(this.bOption, this);
      this.fnOption = __bind(this.fnOption, this);
      this.option = __bind(this.option, this);
      if (!(_.isUndefined(opts) || (_.isObject(opts) && !_.isEmpty(opts)))) {
        throw new Error("Constructor must be undefined or an object as options");
      }
      this._options = opts || {};
      this._components = {};
      this._app = void 0;
    }

    Globals.prototype.option = function(key) {
      if (_.isString(key)) {
        if (arguments.length > 1) {
          this._options[key] = arguments[1];
          return this;
        } else {
          return this._options[key];
        }
      } else {
        if (this._options['failSilently'] !== true) {
          throw new Error("Option must be called with a string as key");
        }
      }
    };

    Globals.prototype.fnOption = function(key) {
      var opt;
      opt = this.option(key);
      if (!_.isFunction(opt) && this._options['failSilently'] !== true) {
        throw new Error("Option " + key + " must be a function");
      }
      return opt;
    };

    Globals.prototype.bOption = function(key) {
      var opt;
      opt = this.option(key);
      if (!_.isBoolean(opt) && this._options['failSilently'] !== true) {
        throw new Error("Option " + key + " must be a boolean");
      }
      return opt;
    };

    Globals.prototype.sOption = function(key) {
      var opt;
      opt = this.option(key);
      if (!_.isString(opt) && this._options['failSilently'] !== true) {
        throw new Error("Option " + key + " must be a string");
      }
      return opt;
    };

    Globals.prototype.oOption = function(key) {
      var opt;
      opt = this.option(key);
      if (!_.isObject(opt) && this._options['failSilently'] !== true) {
        throw new Error("Option " + key + " must be an object");
      }
      return opt;
    };

    Globals.prototype.iOption = function(key, instance) {
      var opt;
      opt = this.option(key);
      if (!(opt instanceof instance) && this._options['failSilently'] !== true) {
        throw new Error("Option " + key + " must be an object");
      }
      return opt;
    };

    Globals.prototype.options = function() {
      var possibleOptions, _i, _len;
      if (arguments.length === 0) {
        return this._options;
      } else {
        for (_i = 0, _len = arguments.length; _i < _len; _i++) {
          possibleOptions = arguments[_i];
          if (_.isObject(possibleOptions)) {
            this._options = _.extend(this._options, possibleOptions);
          } else {
            if (this._options['failSilently'] !== true) {
              throw new Error("Options must be called with an object as argument, or no args at all");
            }
          }
        }
        return this;
      }
    };

    Globals.prototype.config = function() {
      return this.option.apply(this, arguments);
    };

    Globals.prototype.configs = function() {
      return this.options.apply(this, arguments);
    };

    Globals.prototype.component = function(key) {
      if (_.isString(key)) {
        if (arguments.length > 1) {
          this._components[key] = arguments[1];
          return this;
        } else {
          if (_.has(this._components, key)) {
            return this._components[key];
          } else {
            if (this._options['failSilently'] !== true) {
              throw new Error("Component " + key + " wasnt found");
            }
          }
        }
      } else {
        if (this._options['failSilently'] !== true) {
          throw new Error("Component must be called with a string as key");
        }
      }
    };

    Globals.prototype.components = function() {
      return this._components;
    };

    Globals.prototype.app = function() {
      if (arguments.length > 0) {
        this._app = arguments[0];
        return this;
      } else {
        return this._app;
      }
    };

    Globals.prototype.use = function(otherGlobals) {
      if (!(otherGlobals instanceof Globals)) {
        if (!_.isFunction(otherGlobals)) {
          throw new Error("Argument must be a Global object");
        } else if (this.app() == null) {
          throw new Error("App is not defined, cant add handler to express without app defined");
        } else if (this.app() !== otherGlobals) {
          this.app().use(otherGlobals);
        }
      } else {
        if (this !== otherGlobals) {
          this._options = _.extend(this._options, otherGlobals.options());
          this._components = _.extend(this._components, otherGlobals.components());
          if (otherGlobals.app() != null) {
            if (this.app() == null) {
              this.app(otherGlobals.app());
            } else if (this.app() !== otherGlobals.app()) {
              this.app(otherGlobals.app());
            }
          }
        }
      }
      return this;
    };

    Globals.prototype.configure = function() {
      var arg, env, envs, fn, i, _i, _len;
      if (arguments.length > 0) {
        fn = arguments[arguments.length - 1];
      }
      envs = [];
      env = this.option('env');
      if (!_.isString(env) && (this.app() != null)) {
        env = this.app().get('env');
      }
      for (i = _i = 0, _len = arguments.length; _i < _len; i = ++_i) {
        arg = arguments[i];
        if (i !== arguments.length - 1) {
          if (_.isString(arg)) {
            envs.push(arg);
          } else if (_.isArray(arg)) {
            envs = envs.concat(arg);
          } else {
            if (this._options['failSilently'] !== true) {
              throw new Error("Configure must receive a function as last argument and optionally arrays, or strings as environment");
            }
          }
        }
      }
      if (envs.length > 0) {
        if (!_.isString(env)) {
          throw new Error("Environment option must be set thought app or globals.option");
        }
        if (!_.contains(envs, env)) {
          return this;
        }
      }
      if (_.isFunction(fn)) {
        fn(this);
      } else {
        if (this._options['failSilently'] !== true) {
          throw new Error("Configure must receive a function");
        }
      }
      return this;
    };

    return Globals;

  })();

  init = function(opts) {
    return new Globals(opts);
  };

  init.instance = Globals;

  module.exports = init;

}).call(this);
