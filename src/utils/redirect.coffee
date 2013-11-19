url = require 'url'

module.exports = (req, res, place, queryParam)->
	queryParam = queryParam or ''
	if req.headers["referer"]?
		parsed = url.parse req.headers["referer"]
		parsed.search = parsed.search or '?'
		if parsed.search.indexOf(queryParam) is -1
			parsed.search = parsed.search + "&" if parsed.search.length > 1
			parsed.search = parsed.search + "#{queryParam}"
		res.redirect url.format(parsed)
	else
		res.redirect "#{place}?#{queryParam}"
