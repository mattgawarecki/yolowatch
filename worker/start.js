var options = buildWorkerOptions();
require('./worker')(options).start();

function buildWorkerOptions() {
  var config = require('../config');
  var logger = require('../common/logger')(config.logger.level || 'info');

  var now = function() { return new Date().valueOf(); };
  var dataStores = require('./db')({
    logger: logger,
    meta: {
      file: config.db.meta.file,
      now: now
    },
    tweets: {
      file: config.db.tweets.file
    }
  });
  var tweetStream = getTweetStream({
    logger: logger,
    track: 'yolo',
    api: config.worker.api,
    events: config.worker.events,
    emitter: {
      port: config.worker.port
    },
    db: dataStores.tweets,
    now: now
  });

  return {
    logger: logger,
    db: {
      meta: dataStores.meta
    },
    tweets: {
      stream: tweetStream
    }
  };
}

function getTweetStream(options) {
  if (options.emitter.port) {
    options.logger.info('Opening event socket on port ' + options.emitter.port);
  } else {
    options.logger.error(
      "Could not open event socket on port '" + (options.emitter.port || '(none)') + "'."
    );

    return;
  }

  var tweetEmitter = require('./tweet_emitter')({
    logger: options.logger,
    server: require('socket.io')(options.emitter.port),
    minRequestIntervalMs: options.events.throttle_ms || 10000
  });
  var tweetRecorder = require('./tweet_recorder')({
    logger: options.logger,
    db: options.db,
    now: options.now,
    events: {
      onRecorded: tweetEmitter.emit,
      onRejected: function() {
        options.logger.debug('Tweet rejected - did not contain target phrase.');
      }
    }
  });

  var Twit = require('twit');
  return require('./tweet_streamer')({
    api: new Twit({
      consumer_key: '7tICA3DnSrUBrazFg5Yip5t7n',
      consumer_secret: options.api.consumer_secret,
      access_token: '12466862-J0DwVlDtWPl0dtqrmQAFHOBZwawGTUlwAmP4rTO0p',
      access_token_secret: options.api.access_token_secret
    }),
    track: options.track,
    onTweet: tweetRecorder.record
  });
}
