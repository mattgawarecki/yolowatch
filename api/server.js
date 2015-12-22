var config = require('../config');
var logger = require('../common/logger')(config.logger.level || 'info');

logger.info('Starting API server.');
var express = require('express');
var app = express();

logger.debug('Building data model.');
var DataStore = require('nedb');
var YoloWatch = require('./models/yolowatch');
var model = YoloWatch({
  db: {
    meta: new DataStore({ filename: config.db.meta.file }),
    tweets: new DataStore({ filename: config.db.tweets.file })
  }
});

logger.debug('Initializing router.');
var router = require('./router')({
  logger: logger,
  routerFactory: express.Router,
  model: model,
  endpoints: {
    recent: {
      max_count: config.api.recent.max_count || 20
    }
  }
});

app.use('/api', router);

var port = config.api.port || 8081;
var server = app.listen(port, 'localhost', function() {
  var host = server.address().address;
  var port = server.address().port;

  logger.info("API server listening at 'http://%s:%s'.", host, port);
});
