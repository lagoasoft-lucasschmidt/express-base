module.exports = (globals)->
	throw new Error("Globals must be informed") if not (globals instanceof require('./globals').instance)

	class InternalError extends Error
		constructor:(message, @ctx, @originalError)->
			super(message)
			@name = 'Internal Error'

	class InvalidArgumentsError extends Error
		constructor:(message, @ctx)->
			super(message)
			@name = 'Invalid Arguments Error'

	class ValidationError extends Error
		constructor:(message, @ctx, @errors)->
			super(message)
			@name = 'Validation Error'

	class ForbiddenError extends Error
		constructor:(message, @ctx)->
			super(message)
			@name = 'Forbidden Error'

	class NotFoundError extends Error
		constructor:(message, @ctx)->
			super(message)
			@name = 'Not Found Error'

	class ExpectedError extends Error
		constructor:(message, @ctx)->
			super(message)
			@name = 'Expected Error'
			@message = message

	globals.component("error:InternalError", InternalError)
	globals.component("error:InvalidArgumentsError", InvalidArgumentsError)
	globals.component("error:ValidationError", ValidationError)
	globals.component("error:ForbiddenError", ForbiddenError)
	globals.component("error:NotFoundError", NotFoundError)
	globals.component("error:ExpectedError", ExpectedError)

	return globals
