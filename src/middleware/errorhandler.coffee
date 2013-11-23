redirectToRefererOrPlace = require './../utils/redirect'

module.exports = (globals)->
	throw new Error("Globals must be informed") if not (globals instanceof require('./../globals').instance)
	throw new Error("App is required") if not globals.app()?
	logger = globals.component("utils:loggerClass").create(["ERROR_HANDLER"])

	ValidationError = globals.component("error:ValidationError")
	ForbiddenError = globals.component("error:ForbiddenError")
	NotFoundError = globals.component("error:NotFoundError")
	ExpectedError = globals.component("error:ExpectedError")
	InvalidArgumentsError = globals.component("error:InvalidArgumentsError")
	# set up error handler
	process.on 'uncaughtException', (err) -> logger.error msg: "uncaughtException", error: err

	# Function that will determine which error occured and call the correct handler.
	handleError = (err, req, res, next) ->
		logger.warn msg: "Handling error="+err
		## determine what kind of error occured
		if err?.status? and (err?.status is 403) then handleForbidden err, req, res, next
		else if err?.status? and err?.status is 401 then handleNotAuthorized err, req, res, next
		else if err?.status? and err?.status is 400 then handleBadRequest err, req, res, next
		else if err instanceof ValidationError or err instanceof InvalidArgumentsError then handleValidationError err, req, res, next
		else if err instanceof ForbiddenError then handleForbidden err, req, res, next
		else if err instanceof NotFoundError then handleNotFound req, res, next
		else if err instanceof ExpectedError then handleExpectedError err, req, res, next
		else handleInternalError err, req, res, next

	# Handles Errors with status=403, Forbidden.
	handleForbidden = (err, req, res, next) ->
		logger.warn message: "Forbidden access on path=#{req.path}"
		if req.accepts(['html', 'json']) == 'json' then res.json(403, { error: 'Forbidden' })
		else
			req.flash('error', "forbidden")
			redirectToRefererOrPlace(req, res,'/')

	# Handles Errors with status=401, Not Authorized.
	handleNotAuthorized = (err, req, res, next) ->
		logger.warn message: "Not Authorized access on path=#{req.path}"
		if req.accepts(['html', 'json']) == 'json' then res.json(401, { error: 'Not Authorized' })
		else
			req.flash('error', "notAuthorized")
			redirectToRefererOrPlace(req, res, '/')

	# Handles Errors with status=404, Not Found.
	handleNotFound = (req, res, next) ->
		logger.warn message: "Not Found access on path=#{req.path}"
		if req.accepts(['html', 'json']) == 'json' then res.json(404, { error: 'Not Found' })
		else
			req.flash('error', "notFound")
			req.flash('errorMessage', req.__("Página %s não foi encontrado.", req.path))
			redirectToRefererOrPlace(req, res, '/')

	# Handles Errors with status=400, Bad Request.
	handleBadRequest = (err, req, res, next) ->
		logger.warn message: "Bad Request access on path=#{req.path}"
		if req.accepts(['html', 'json']) == 'json' then res.json(400, { error: 'Bad Request' })
		else
			req.flash('error', "badRequest")
			redirectToRefererOrPlace(req, res,'/')

	# Handles Errors of type ValidationError.
	handleValidationError = (err, req, res, next) ->
		if req.accepts(['html', 'json']) == 'json' then res.json(400, { error: 'Validation Error', errors: err.errors })
		else
			req.flash('error', "badRequest")
			req.flash('validationErrors', err.errors)
			redirectToRefererOrPlace(req, res, '/')

	handleExpectedError = (err, req, res, next) ->
		if req.accepts(['html', 'json']) == 'json' then res.json(409, { error: 'Expected Error', message: err.message })
		else
			req.flash('error', "expectedError")
			req.flash('errorMessage', err.message)
			redirectToRefererOrPlace(req, res, '/')

	# Handles all other Errors.
	handleInternalError = (err, req, res, next) ->
		logger.error message: "Handling internal error on path=#{req.path}", error: err.error or err
		if req.accepts(['html', 'json']) == 'json' then res.json(500, { error: 'Internal Error' })
		else
			req.flash('error', "internalError")
			redirectToRefererOrPlace(req, res, '/')

	app = globals.app()
	# set app handler

	app.use (err, req, res, next) ->
		handleError err, req, res, next

	app.use (req, res, next)->
		handleNotFound(req, res, next)

	return app