var config = require('../common/config');
var logger = require('../common/logger');

logger.info('Starting API server.');
var express = require('express');
var app = express();

logger.debug('Initializing router.');
var router = require('./router');
app.use('/api', router);

var port = config.api.port || 8081;
var server = app.listen(port, function() {
  var host = server.address().address;
  var port = server.address().port;

  logger.info("API server listening at 'http://%s:%s'.", host, port);
});
