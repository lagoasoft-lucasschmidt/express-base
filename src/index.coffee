_ = require 'underscore'

module.exports = (globals) =>
	throw new Error("Globals must be informed of type Globals or undefined") if not(globals instanceof require('./globals').instance)
	options = globals.options()
	express = options.express

	app = globals.option("express")()
	globals.app(app) if not globals.app()

	logger = globals.option("setupLogger") or ()->
	throw new Error("setupLogger must be a function") if !_.isFunction(logger)
	# Define Port
	app.port = options.port if options.port?

	# Set up views Dir
	if _.isString(options.viewsDir)
		logger "Setting viewsDir as #{options.viewsDir}"
		app.set('views', options.viewsDir)
	else logger "Didnt set viewsDir"

	if options.enableViewCache
		logger "Enabling view cache"
		app.enable('view cache')

	# Set up view engine
	if _.isString(options.viewEngine)
		logger "Setting viewEngine as #{options.viewEngine}"
		app.set('view engine', options.viewEngine)
	else logger "Didnt set viewEngine"

	# set start time of request
	if options.disableRequestTime isnt false
		logger "Setting up header that times request"
		app.use (req, res, next)->
			start = new Date
			if res._responseTime then return next()
			res._responseTime = true
			res.on 'header', (header) ->
				duration = new Date - start
				res.setHeader('X-Response-Time', duration + 'ms')
			next()
	else logger "Did not set up header that times request"

	# enable express logger
	if options.requestLogger
		logger "Setting up request logger"
		if options.requestLogger is true
			logger "Setting up express.logger"
			app.use express.logger()
		else if _.isFunction(options.requestLogger)
			logger "Setting up middleware requestLogger informed"
			app.use options.requestLogger
		else throw new Error("options.requestLogger must be a boolean (default request logger) or a function to be used by express")
	else logger "Did not set up any request logger"

	# enable compression for responses
	if options.disableCompression isnt false
		logger "Setting up express.compression"
		app.use express.compress()
	else logger "Did not setup express.compression"

	# enable cookies parser
	if options.disableCookies isnt false
		logger "Setting up cookies support"
		app.use express.cookieParser(globals.sOption("cookieSecret"))
	else logger "Did not setup cookies support"

	# [Body parser middleware](http://www.senchalabs.org/connect/middleware-bodyParser.html) parses JSON or XML bodies into `req.body` object
	if options.disableBodyParser isnt false
		logger "Setting up body parser, except for file upload"
		app.use express.json()
		app.use express.urlencoded()
	else logger "Did not setup body parser"

	# enable method override
	if options.disableMethodOverride isnt false
		logger "Setting up method override"
		app.use express.methodOverride()
	else logger "Did not setup method override"

	# validate body
	if options.enableExpressValidator
		logger "Setting up support for express-validator into request"
		expressValidator = require('express-validator')
		app.use(expressValidator())
	else logger "Did not setup express-validator"

	# set up session store
	if options.disableSession isnt false
		throw new Error("Cookies must be enabled") if options.disableCookies is true
		logger "Setting up session support"
		if _.isObject(options.sessionConfig)
			logger "Setting up session support based on config and express.session"
			app.use express.session(options.sessionConfig)
		else if _.isFunction(options.sessionMiddleware)
			logger "Setting up session support based on sessionMiddleware informed"
			app.use options.sessionMiddleware
	else logger "Did not set up session"

	# enable flash attributes
	if options.disableFlash isnt false
		throw new Error("Session must be enabled") if options.disableSession is true
		flash = require('connect-flash')
		app.use(flash())

	# enable csrf protection
	if options.disableCsrf isnt false
		throw new Error("Session must be enabled") if options.disableSession is true
		logger "Setting up csrf support"
		app.use express.csrf()
		# middleware to store crsf as response local variable
		app.use (req, res, next)->
			res.locals.csrf = req.csrfToken()
			next()
	else logger "Did not set up csrf support"

	#### i18n
	if options.disableI18n isnt false
		logger "Setting up i18n support"
		i18n = require('i18n')
		i18n.configure globals.oOption("i18nConfig")
		# middleware to determine locale from header if not set on cookies
		app.use i18n.init
		# set locals variable to be used by template
		app.use (req, res, next) ->
			# middleware to set i18n as variable on templates
			res.locals.__ = req.__ = res.__ = -> i18n.__.apply(req, arguments)
			# middleware to set locale from a query string eg: ?locale=en
			i18n.overrideLocaleFromQuery(req)
			# middleware to save locale as a cookie configuration
			res.cookie(options.i18nConfig.cookie, i18n.getLocale(req))
			# set locale as variable
			res.locals.locale = i18n.getLocale(req)
			res.locals.i18n = i18n.getCatalog(req)
			next()
	else logger "Did not setup i18n support"

	# discover device
	if options.disableDeviceDetection isnt false
		logger "Setting up express device detection"
		device = require 'express-device'
		app.use(device.capture())
		# mobile detection / locals template variables
		app.use (req, res, next)->
			res.locals.device = req.device
			res.locals.mobile = false
			if req.device?.type is 'phone' or req.device?.type is 'tablet'
				res.locals.mobile = true
			next()
	else logger "Did not setup express device detection"

	# error handler middleware support
	if options.disableErrorHandler isnt false
		logger "Setting up Error Handler necessary middleware"
		throw new Error("Flash must be enable") if options.disableFlash is true
		app.use (req, res, next) ->
			# validation errors, init as null
			res.locals.validationErrors = req.flash('validationErrors') or null
			res.locals.errorMessages = req.flash('errorMessage') or null
			res.locals.errors = req.flash('error') or null
			res.locals.query = req.query or {}
			next()
	else logger "Did not setup integrated error handler necessary middleware"

	# middleware to store underscore
	if options.disableUnderscoreOnResponseLocals isnt false
		logger "Setting up underscore as a local response variable"
		app.use (req, res, next)->
			res.locals._ = require('underscore')
			next()
	else logger "Did not set up underscore as local response variable"

	# use cartero to be able to inject js into views
	if _.isString(options.carteroDir)
		logger "Setting up cartero with dir #{options.carteroDir}"
		carteroMiddleware = require( "cartero-express-hook" )
		app.use(carteroMiddleware( globals.sOption("carteroDir")))
	else logger "Didnt set up cartero"

	return globals


