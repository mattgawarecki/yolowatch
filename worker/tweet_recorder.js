module.exports = function(options) {
  return {
    record: function(tweet) {
      options.logger.debug('Tweet received.');

      if (tweet.text.match(/yolo/i)) {
        options.db.insert({
          type: 'tweet',
          timestamp: options.now(),
          screen_name: tweet.user.screen_name,
          text: tweet.text
        }, function(err, newDoc) {
          if (err) {
            options.logger.error('Could not record tweet.');
            options.logger.error(err);
          } else {
            options.logger.debug('Tweet recorded.');
            options.logger.silly('[@' + newDoc.screen_name + '] ' + newDoc.text);

            options.events.onRecorded(tweet);
          }
        });
      } else {
        options.events.onRejected(tweet);
      }
    }
  }
};
