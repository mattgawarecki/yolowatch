var db = require('../db');

var mock = {
  getData: function(callback) {
    callback({
      start: new Date(),
      count: Math.random()
    });
  }
};

var YoloWatch = {
  getData: function(onError, onSuccess) {
    db.loadDatabase();
    db.findOne({}, function(err, doc) {
      if (err) onError(err);
      else onSuccess(doc);
    });
  }
};

module.exports = process.env.YOLOWATCH_WEB_DEVELOPMENT_MODE
  ? mock
  : YoloWatch;
