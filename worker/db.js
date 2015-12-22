var DataStore = require('nedb');

module.exports = function(options) {
  var db = {};
  db.meta = new DataStore({ filename: options.meta.file, autoload: true });
  db.tweets = new DataStore({ filename: options.tweets.file, autoload: true });

  db.meta.initialize = function(callback) {
    options.logger.debug("Initializing 'meta' database.");
    db.meta.findOne({ $where: function() { return 'start_date' in this; } }, function(err, doc) {
      if (err) {
        options.logger.error('Error occurred during check for proper initialization.');
        options.logger.error(err);
      } else if (doc) {
        options.logger.debug('Database already initialized.');
        options.logger.silly('Start date:', doc.start_date);
        callback(null, doc);
      } else {
        db.meta.insert({ start_date: options.meta.now() }, function(err, newDoc) {
          if (err) {
            options.logger.error('Error occurred while initializing.');
            options.logger.error(err);
            callback(err);
          } else {
            options.logger.debug('Database initialized successfully.');
            options.logger.silly('Start date:', newDoc.start_date);
            callback(null, newDoc);
          }
        });
      }
    });
  };

  return db;
};
