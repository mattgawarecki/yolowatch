var config = require('../common/config');
var logger = require('../common/logger');
var moment = require('moment');

var Watcher = require('./watcher');

logger.info('Starting worker process.');

var db = require('./db');
db.initialize(function(err, doc) {
  if (err) {
    logger.error('Cannot continue. Shutting down.');
  } else {
    var w = Watcher(config.worker.consumer_secret, config.worker.access_token_secret);
    w.start(function(tweet) { return onYolo(db, tweet); });

    logger.info('Worker process started.');
    // Run forever until the process is killed
  }
});

function onYolo(db, tweet) {
  var counters = getCounters();
  counters.forEach(function(dbKey) {
    db.update(dbKey, { $inc: { count: 1 } }, { upsert: true }, function() {
      logger.debug('Counter updated:', dbKey);
    });
  });
}

function getCounters() {
  var now = moment();
  now.utc();

  return [
    { type: 'all' },
    {
      type: 'year',
      key: { year: now.year() }
    },
    {
      type: 'month',
      key: {
        year: now.year(),
        month: now.month() + 1
      }
    },
    {
      type: 'hour',
      key: {
        year: now.year(),
        month: now.month() + 1,
        date: now.date(),
        hour: now.hour()
      }
    }
  ];
};
