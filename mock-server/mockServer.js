var connect = require('connect');
var serveStatic = require('serve-static');
// var bodyParser = require('body-parser');
var fs = require('fs');
var url = require('url');
var path = require('path');
var app = connect();

// app.use(bodyParser.urlencoded({extended:false}));
// app.use(bodyParser.json());

app.use(function (req,res,next) {
  console.log('MOCK',req.headers['content-type'],req.url,req.headers.cookie,req.body);
  var params = url.parse(req.url, true);
  var pathname = params.pathname;
  var file = path.join(__dirname, pathname);
  fs.readFile(file,function (err,data) {
    if(err){
      return next({message:'Not Found ' + pathname,statusCode:404});
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(data.toString());
  })
})

//错误处理
app.use(function(err, req, res, next) {
  res.statusCode = err.statusCode;
  res.end(JSON.stringify({noteMsg: err.message, success: false}));
});

app.listen(3001,function (err) {
  if(!err){
    console.log('mock server start ...','on port 3001');
  }
});