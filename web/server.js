var path = require('path');
var express = require('express');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

require('./routes')(app);

var port = process.env.YOLOWATCH_WEB_PORT || 8080;
var server = app.listen(port, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Web server listening at http://%s:%s', host, port);
});
