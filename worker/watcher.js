var logger = require('../common/logger');

var Twit = require('twit');
var T = new Twit({
  consumer_key: '7tICA3DnSrUBrazFg5Yip5t7n',
  consumer_secret: process.env.YW_TWITTER_CONSUMER_SECRET,
  access_token: '12466862-J0DwVlDtWPl0dtqrmQAFHOBZwawGTUlwAmP4rTO0p',
  access_token_secret: process.env.YW_TWITTER_ACCESS_TOKEN_SECRET
});

module.exports = {
  start: function(onTweet) {
    var stream = T.stream('statuses/filter', { track: 'yolo' });
    stream.on('tweet', function(tweet) {
      logger.debug('Tweet received.');
      logger.silly(tweet.text);
      onTweet(tweet);
      logger.debug('Tweet processed.');
    });
  }
};
