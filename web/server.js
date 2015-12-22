var config = require('../config');
var logger = require('../common/logger')(config.logger.level || 'info');

logger.info('Starting web server.');
var express = require('express');
var app = express();

logger.debug('Setting static assets route.');

var path = require('path');
var staticPath = path.join(__dirname, 'public');
logger.silly('Location:', staticPath);
app.use(express.static(staticPath));

logger.debug('Setting views path.');
var viewsPath = path.join(__dirname, 'views');
logger.silly('Location:', viewsPath);
app.set('views', viewsPath);

logger.debug('Setting views engine.');
app.set('view engine', 'jade');

logger.debug('Initializing router.');
app.get('/', function(req, res) {
  res.render('index');
});

var port = config.web.port || 8080;
var server = app.listen(port, 'localhost', function() {
  var host = server.address().address;
  var port = server.address().port;

  logger.info("Web server listening at 'http://%s:%s'.", host, port);
});
