_ = require 'underscore'

class Globals
	constructor:(opts)->
		throw new Error("Constructor must be undefined or an object as options") if not(_.isUndefined(opts) or (_.isObject(opts) and !_.isEmpty(opts)))
		@_options = opts or {}
		@_components = {}
		@_app = undefined

	option:(key)=>
		if _.isString(key)
			if arguments.length > 1
				@_options[key] = arguments[1]
				return @
			else
				return @_options[key]
		else
			throw new Error("Option must be called with a string as key") if @_options['failSilently'] isnt true

	fnOption:(key)=>
		opt = @option(key)
		throw new Error("Option #{key} must be a function") if !_.isFunction(opt) and @_options['failSilently'] isnt true
		return opt

	bOption:(key)=>
		opt = @option(key)
		throw new Error("Option #{key} must be a boolean") if !_.isBoolean(opt) and @_options['failSilently'] isnt true
		return opt

	sOption:(key)=>
		opt = @option(key)
		throw new Error("Option #{key} must be a string") if !_.isString(opt) and @_options['failSilently'] isnt true
		return opt

	oOption:(key)=>
		opt = @option(key)
		throw new Error("Option #{key} must be an object") if !_.isObject(opt) and @_options['failSilently'] isnt true
		return opt

	iOption:(key, instance)=>
		opt = @option(key)
		throw new Error("Option #{key} must be an object") if !(opt instanceof instance) and @_options['failSilently'] isnt true
		return opt

	options:=>
		if arguments.length is 0
			return @_options
		else
			for possibleOptions in arguments
				if _.isObject(possibleOptions)
					@_options = _.extend @_options, possibleOptions
				else throw new Error("Options must be called with an object as argument, or no args at all") if @_options['failSilently'] isnt true
			return @

	config:=> @option.apply(@, arguments)

	configs:=> @options.apply(@, arguments)

	component:(key)=>
		if _.isString(key)
			if arguments.length > 1
				@_components[key] = arguments[1]
				return @
			else
				if _.has(@_components, key)
					return @_components[key]
				else
					throw new Error("Component #{key} wasnt found") if @_options['failSilently'] isnt true
		else
			throw new Error("Component must be called with a string as key") if @_options['failSilently'] isnt true

	components:=> @_components

	app:=>
		if arguments.length > 0
			@_app = arguments[0]
			return @
		else
			return @_app

	use:(otherGlobals)=>
		if not(otherGlobals instanceof Globals)
			if !_.isFunction(otherGlobals) then throw new Error("Argument must be a Global object")
			else if not @app()? then throw new Error("App is not defined, cant add handler to express without app defined")
			else if @app() isnt otherGlobals then @app().use(otherGlobals)
		else
			if @ isnt otherGlobals
				@_options = _.extend @_options, otherGlobals.options()
				@_components = _.extend @_components, otherGlobals.components()
				if otherGlobals.app()?
					if not @app()? then @app(otherGlobals.app())
					else if @app() isnt otherGlobals.app()
						@app(otherGlobals.app())
		return @

	configure:()=>
		fn = arguments[arguments.length - 1] if arguments.length > 0
		envs = []
		env = @option('env')
		env = @app().get('env') if !_.isString(env) and @app()?
		# detect environments based on arguments
		for arg, i in arguments when i isnt arguments.length - 1
			if _.isString(arg) then envs.push arg
			else if _.isArray(arg) then envs = envs.concat arg
			else throw new Error("Configure must receive a function as last argument and optionally arrays, or strings as environment") if @_options['failSilently'] isnt true
		# only execute if no envs were informed, or if env is matched
		if envs.length > 0
			throw new Error("Environment option must be set thought app or globals.option") if !_.isString(env)
			if !_.contains(envs, env) then return @
		# execute function
		if _.isFunction(fn)
			fn(@)
		else throw new Error("Configure must receive a function") if @_options['failSilently'] isnt true
		return @

init = (opts)-> return new Globals(opts)
init.instance = Globals

module.exports = init
