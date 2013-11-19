passport = require 'passport'
LocalStrategy = require('passport-local').Strategy

module.exports = (globals)->
	throw new Error("Globals must be informed") if not (globals instanceof require('./../globals').instance)
	throw new Error("App is required") if not globals.app()?
	app = globals.app()
	logger = globals.iOption("securityLogger", globals.component("utils:loggerClass"))
	UserService = globals.component("service:user")
	ExpectedError = globals.component("error:ExpectedError")

	authenticate = (req, res, next, redirect=true)->
		logger.debug message: "Trying to authenticate user", ctx: res.locals.ctx
		passport.authenticate 'local', { session: true}, (err, user, info)->
			logger.trace message: "Received response from trying to authenticate user", ctx: res.locals.ctx
			if err or not(user)
				logger.error message: "Couldnt authenticate user, info=#{info} and error=#{err} and user=#{user}", ctx: res.locals.ctx
				next(new ExpectedError(req.__("Sorry, but you must be authenticated to access that page!")))
			else
				logger.info message:"Didnt find an error, authenticated with user id=#{user?.id} and info=#{info}", ctx: res.locals.ctx
				req.logIn user, (error)->
					if error then return callback(error)
					if redirect then res.redirect('/') else next()

	globals.component "security:authenticate",(req, res, next)->
		authenticate(req, res, next, false)(req, res, next)

	## MIDDLEWARE
	globals.component "security:isAuthenticated", (req, res, next) ->
		if req.isAuthenticated()
			logger.trace message: "User is authenticated"
			next()
		else
			logger.info message: "User is not authenticated"
			next(new ExpectedError(req.__("Sorry, but you must be authenticated to access that page!")))

	globals.component "security:isNotAuthenticated", (req, res, next) ->
		if not req.isAuthenticated()
			logger.trace message: "User is not authenticated"
			next()
		else
			logger.info message: "User is authenticated, forbidden access to #{req.path}"
			next(new ExpectedError(req.__("Sorry, but you cant be authenticated to access that page!")))

	globals.component "security:isAdmin", (req, res, next) ->
		if req.isAuthenticated() and req.user.role is 'ADMIN'
			logger.trace message: "User is an admin"
			next()
		else
			logger.info message: "User is not authenticated or is not an admin, forbidden access to #{req.path}"
			next(new ExpectedError(req.__("Sorry, but you do not have access to that page!")))

	## CONFIGURATION
	# set up session serialization based on [configure] (http://passportjs.org/guide/configure/)
	passport.serializeUser (user, done) ->
		logger.trace message: "Serializing user with id=#{user.id}"
		done(null, user.id)
	passport.deserializeUser (id, done) ->
		logger.trace message: "Deserializing user with id=#{id}"
		UserService.retrieveUserById(id)
			.then( (user)->
				done(null, user)
			).fail( (error)->
				done(error)
			).done()

	passport.use new LocalStrategy {passReqToCallback: true}, (req, username, password, done)->
		logger.trace message: "Trying to authenticate user with username=#{username}", ctx: req.locals.ctx
		foundUser = null
		UserService.retrieveUserByEmail(username, req.locals.ctx)
			.then( (user)->
				if not user then return null
				foundUser = user
				UserService.doesPasswordMatch(user, password, req.locals.ctx)
			).then( (result)->
				if not result then done(null, null)
				else done(null, foundUser)
			).fail( (error)->
				done(error)
			).done()

	# initialize
	app.use passport.initialize()
	# enable session
	app.use passport.session()
	# add logged user as local variable (available to templates)
	app.use (req, res, next) ->
		if req.isAuthenticated()
			res.locals.user = req.user
			res.locals.hasUserLoggedIn = true
			res.locals.role = req.user.role
		else
			res.locals.hasUserLoggedIn = false
			res.locals.user = false
			res.locals.role = null
		next()

	return globals
