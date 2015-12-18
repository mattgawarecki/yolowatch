var db = require('../../common/db');

function sanitizeCounterData(data) {
  var sanitized = {
    type: 'counter',
    counter_type: data.type,
    count: data.count
  };

  if (data.key) {
    var keyFields = Object.keys(data.key);
    if (keyFields.length === 1) sanitized.id = data.key[keyFields[0]];
    else sanitized.id = data.key;
  }

  return sanitized;
}

var YoloWatch = {
  getMeta: function(callback) {
    db.loadDatabase();
    db.findOne(
      { $where: function() { return 'meta' in this; } },
      { _id: 0 },
      function(err, doc) {
        if (err) callback(err);
        else {
          var sanitized = { type: 'meta' };
          Object.keys(doc.meta).forEach(function(k) { sanitized[k] = doc.meta[k]; });

          return callback(null, { data: sanitized });
        }
      }
    );
  },

  getCounter: function(key, callback) {
    return module.exports.getCounters(key, function(err, data) {
      if (err) {
        return callback(err);
      } else {
        if (data.data.length === 0) {
          return callback('Error');
        } else if (data.data.length === 1) {
          data.data = data.data[0];
          return callback(null, data);
        } else {
          return callback('Error');
        }
      }
    });
  },

  getCounters: function(key, callback) {
    db.loadDatabase();
    db.find(
      key,
      { _id: 0 },
      function(err, docs) {
        if (err) return callback(err);
        else {
          var result = {
            data: docs.map(sanitizeCounterData)
          };

          return callback(null, result);
        }
      }
    )
  }
};

module.exports = YoloWatch;
