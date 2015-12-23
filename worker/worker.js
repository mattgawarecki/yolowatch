module.exports = function(options) {
  return {
    start: function() {
      options.logger.info('Starting worker process.');

      options.db.meta.initialize(function(err, doc) {
        if (err) {
          options.logger.error('Cannot continue. Shutting down.');
        } else {
          options.tweets.stream.start();
          options.logger.info('Worker process started.');
          // Run forever until the process is killed
        }
      });
    }
  }
};
