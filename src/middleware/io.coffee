_ = require 'underscore'


module.exports = (globals)->
	throw new Error("Globals must be informed") if not (globals instanceof require('./../globals').instance)
	throw new Error("App is required") if not globals.app()?
	throw new Error("Session config is required") if not _.isObject(globals.option("sessionConfig"))

	config = globals.options()
	app = globals.oOption("ioApp")
	express = globals.option('express')

	# init io
	app.http().io()

	app.io.set('log level', 3)

	if config.websocketsPoolingOnly is true
		app.io.set("transports", ["xhr-polling"])
		app.io.set("polling duration", 10);

	# set up authorization
	# if globals.disableIOSecurity isnt false
	# 	passport = require 'passport'
	# 	passportSocketIo = require("passport.socketio")
	# 	config.sessionConfig.passport = passport
	# 	config.sessionConfig.cookieParser = config.express.cookieParser
	# 	config.sessionConfig.success = (data, accept) ->
	# 		old_auth data, accept
	# 	old_auth = app.io.get 'authorization'
	# 	app.io.set 'authorization', passportSocketIo.authorize(config.sessionConfig)

	passportSocketIo = require("passport.socketio")
	app.io.set "authorization", passportSocketIo.authorize(
		cookieParser: express.cookieParser #or connect.cookieParser
		key: config.sessionConfig.key #the cookie where express (or connect) stores its session id.
		secret: config.sessionConfig.secret #the session secret to parse the cookie
		store: config.sessionConfig.store #the session store that express uses
		fail: (data, accept) -> # *optional* callbacks on success or fail
			accept null, false # second param takes boolean on whether or not to allow handshake

		success: (data, accept) ->
			accept null, true
	)

	# set store
	redisOpts =
			redis: require 'redis'
			redisPub: globals.component("redis").createClient()
			redisSub: globals.component("redis").createClient()
			redisClient: globals.component("redis").defaultClient()
	app.io.set('store', new express.io.RedisStore(redisOpts))

	app.io.route 'ready', (req) ->
		console.log "User is ready on socket io with credentials=#{JSON.stringify(req.handshake.user)}"

	return globals
