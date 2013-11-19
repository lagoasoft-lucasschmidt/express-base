(function() {
  var url;

  url = require('url');

  module.exports = function(req, res, place, queryParam) {
    var parsed;
    queryParam = queryParam || '';
    if (req.headers["referer"] != null) {
      parsed = url.parse(req.headers["referer"]);
      parsed.search = parsed.search || '?';
      if (parsed.search.indexOf(queryParam) === -1) {
        if (parsed.search.length > 1) {
          parsed.search = parsed.search + "&";
        }
        parsed.search = parsed.search + ("" + queryParam);
      }
      return res.redirect(url.format(parsed));
    } else {
      return res.redirect("" + place + "?" + queryParam);
    }
  };

}).call(this);
