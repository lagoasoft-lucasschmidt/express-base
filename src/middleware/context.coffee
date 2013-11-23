module.exports = (globals) =>
	throw new Error("Globals must be informed of type Globals or undefined") if not(globals instanceof require('./../globals').instance)

	app = globals.app()

	app.use (req, res, next) ->
		if res.locals.ctx? then return next()
		res.locals.ctx = {}
		res.locals.ctx.sessionid = req.session.id if req.session?.id?
		res.locals.ctx.user = res.locals.user if res.locals.user?
		res.locals.ctx.role = res.locals.user.role if res.locals.user?.role?
		res.locals.ctx.hasUserLoggedIn = res.locals.hasUserLoggedIn if res.locals.hasUserLoggedIn?
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


