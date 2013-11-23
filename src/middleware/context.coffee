_ = require 'underscore'

module.exports = (globals) =>
	throw new Error("Globals must be informed of type Globals or undefined") if not(globals instanceof require('./../globals').instance)

	app = globals.app()

	app.use (req, res, next) ->
		if res.locals.ctx? then return next()
		res.locals.ctx = {}
		res.locals.ctx.sessionid = req.session.id if req.session?.id?
		res.locals.ctx.user = req.user if req.isAuthenticated() and req.user?
		res.locals.ctx.role = req.user.role if req.user?.role?
		res.locals.ctx.hasUserLoggedIn = req.isAuthenticated() if _.isFunction(req.isAuthenticated)
		res.locals.ctx.locale = res.locals.locale if res.locals.locale?
		res.locals.ctx.path = req.path
		res.locals.ctx.method = req.method
		res.locals.ctx.ip = req.ip
		res.locals.ctx.device = req.device if res.locals.device?
		res.locals.ctx.mobile = req.mobile if res.locals.mobile?
		if req.locals?.ctx then return next()
		if not req.locals? then req.locals = {}
		req.locals.ctx = res.locals.ctx
		next()

	return globals


