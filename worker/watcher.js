var Twit = require('twit');

module.exports = function(options) {
  var T = new Twit(options.credentials);

  return {
    start: function() {
      var stream = T.stream('statuses/filter', { track: 'yolo' });
      stream.on('tweet', options.onTweet);
    }
  };
};
