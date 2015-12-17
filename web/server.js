var logger = require('../common/logger');

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

var apiRouter = require('../api/router');
app.use('/api', apiRouter);

var port = process.env.YW_WEB_PORT || 8080;
var server = app.listen(port, function() {
  var host = server.address().address;
  var port = server.address().port;

  logger.info("Web server listening at 'http://%s:%s'.", host, port);
});
