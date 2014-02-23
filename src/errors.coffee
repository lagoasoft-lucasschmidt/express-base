module.exports = (globals)->
	throw new Error("Globals must be informed") if not (globals instanceof require('./globals').instance)

	class AppError extends Error
		constructor:(message)->
			super(message)

	class InternalError extends AppError
		constructor:(message, @ctx, @originalError)->
			super(message)
			@name = 'Internal Error'

	class InvalidArgumentsError extends AppError
		constructor:(message, @ctx)->
			super(message)
			@name = 'Invalid Arguments Error'

	class ValidationError extends AppError
		constructor:(message, @ctx, @errors)->
			super(message)
			@name = 'Validation Error'

	class ForbiddenError extends AppError
		constructor:(message, @ctx)->
			super(message)
			@name = 'Forbidden Error'

	class NotFoundError extends AppError
		constructor:(message, @ctx)->
			super(message)
			@name = 'Not Found Error'

	class ExpectedError extends AppError
		constructor:(message, @ctx)->
			super(message)
			@name = 'Expected Error'

	class FatalError extends AppError
		constructor:(message, @ctx, @originalError)->
			super(message)
			@name = 'Fatal Error'

	class HandledInternalError extends AppError
		constructor:(message, @ctx, @originalError)->
			super(message)
			@name = 'Handled Internal Error'

	globals.component("error:AppError", AppError)
	globals.component("error:InternalError", InternalError)
	globals.component("error:InvalidArgumentsError", InvalidArgumentsError)
	globals.component("error:ValidationError", ValidationError)
	globals.component("error:ForbiddenError", ForbiddenError)
	globals.component("error:NotFoundError", NotFoundError)
	globals.component("error:ExpectedError", ExpectedError)
	globals.component("error:FatalError", FatalError)
	globals.component("error:HandledInternalError", HandledInternalError)

	return globals
