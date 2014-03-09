(function() {
  var _;

  _ = require('underscore');

  module.exports = function(globals) {
    var app, config, express, passportSocketIo, redisOpts;
    if (!(globals instanceof require('./../globals').instance)) {
      throw new Error("Globals must be informed");
    }
    if (globals.app() == null) {
      throw new Error("App is required");
    }
    if (!_.isObject(globals.option("sessionConfig"))) {
      throw new Error("Session config is required");
    }
    config = globals.options();
    app = globals.oOption("ioApp");
    express = globals.option('express');
    app.http().io();
    app.io.set('log level', 3);
    if (config.websocketsPoolingOnly === true) {
      app.io.set("transports", ["xhr-polling"]);
      app.io.set("polling duration", 10);
    }
    passportSocketIo = require("passport.socketio");
    app.io.set("authorization", passportSocketIo.authorize({
      passport: require('passport'),
      cookieParser: express.cookieParser,
      key: config.sessionConfig.key,
      secret: config.sessionConfig.secret,
      store: config.sessionConfig.store,
      fail: function(data, message, error, accept) {
        return accept(null, false);
      },
      success: function(data, accept) {
        return accept(null, true);
      }
    }));
    redisOpts = {
      redis: require('redis'),
      redisPub: globals.component("redis").createClient(),
      redisSub: globals.component("redis").createClient(),
      redisClient: globals.component("redis").defaultClient()
    };
    app.io.set('store', new express.io.RedisStore(redisOpts));
    app.io.route('ready', function(req) {
      return console.log("User is ready on socket io with credentials=" + (JSON.stringify(req.handshake.user)));
    });
    return globals;
  };

}).call(this);
