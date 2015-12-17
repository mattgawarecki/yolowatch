var logger = require('../common/logger');
var moment = require('moment');
var path = require('path');
var DataStore = require('nedb');

var dbPath = path.join(__dirname, '../db');
var db = new DataStore({ filename: dbPath });
db.initialize = function(callback) {
  db.loadDatabase();

  logger.debug('Initializing database.');
  db.findOne({ $where: function() { return 'meta' in this; } }, function(err, doc) {
    if (doc) {
      logger.debug('Database already initialized.');
      logger.silly('Start date:', doc.meta.start_date);
      callback(null, doc);
    } else {
      db.insert({ meta: { start_date: moment().toDate() } }, function(err, newDoc) {
        if (newDoc) {
          logger.debug('Database initialized successfully.');
          logger.silly('Start date:', newDoc.meta.start_date);
          callback(null, newDoc);
        } else {
          logger.error('Error occurred while initializing database:', err);
          callback(err);
        }
      });
    }
  });
};

module.exports = db;
