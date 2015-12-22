var config = require('../config');
var logger = require('../common/logger')(config.logger.level);
var DB = require('./db');
var Watcher = require('./watcher');

var moment = require('moment');

logger.info('Starting worker process.');

var dataStores = getDataStores();
var metaDb = dataStores.meta;
var tweetDb = dataStores.tweets;

metaDb.initialize(function(err, doc) {
  if (err) {
    logger.error('Cannot continue. Shutting down.');
  } else {
    var w = getWatcher();
    w.start();

    logger.info('Worker process started.');
    // Run forever until the process is killed
  }
});

function now() {
  return moment().utc().valueOf();
}

function getDataStores() {
  return DB({
    logger: logger,
    meta: {
      file: config.db.meta.file,
      now: now
    },
    tweets: {
      file: config.db.tweets.file
    }
  });
}

function getWatcher() {
  return Watcher({
    credentials: {
      consumer_key: '7tICA3DnSrUBrazFg5Yip5t7n',
      consumer_secret: config.worker.consumer_secret,
      access_token: '12466862-J0DwVlDtWPl0dtqrmQAFHOBZwawGTUlwAmP4rTO0p',
      access_token_secret: config.worker.access_token_secret
    },
    onTweet: onYolo
  });
}

function onYolo(tweet) {
  logger.debug('Tweet received.');

  if (tweet.text.match(/yolo/i)) {
    tweetDb.insert({
      type: 'tweet',
      timestamp: now(),
      screen_name: tweet.user.screen_name,
      text: tweet.text
    }, function(err, newDoc) {
      if (err) {
        logger.error('Could not record tweet.');
        logger.error(err);
      } else {
        logger.debug('Tweet recorded.');
        logger.silly('[@' + newDoc.screen_name + '] ' + newDoc.text);
      }
    });
  } else {
    logger.debug('Tweet rejected - does not explicitly contain the targeted phrase.');
  }
}
