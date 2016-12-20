var path = require('path');
var url = require('url');
var fs = require('fs');


module.exports = function(req,res,next) {
  var params = url.parse(req.url, true);
  var pathname = params.pathname;
  var file = path.join(__dirname, pathname);
  fs.readFile(file, function (err,data) {
    if (err) {
      return next({message:'Not Found ' + pathname,statusCode:404});
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(data.toString());
  })
}