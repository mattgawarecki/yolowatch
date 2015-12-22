var YoloWatch = function(options) {
  var metaDb = options.db.meta;
  var tweetsDb = options.db.tweets;

  return {
    getStartDate: function(callback) {
      metaDb.loadDatabase();
      metaDb.findOne(
        { $where: function() { return 'start_date' in this; } },
        { _id: 0 },
        function(err, doc) {
          if (err) return callback(err);
          else return callback(null, { start_date: doc.start_date });
        }
      );
    },

    getRecent: function(count, callback) {
      tweetsDb.loadDatabase();
      tweetsDb.find({}, { _id: 0 }).sort({ timestamp: -1 }).limit(count).exec(function(err, docs) {
        if (err) return callback(err);
        else {
          var sanitized = docs.map(function(d) {
            return {
              type: 'tweet',
              timestamp: d.timestamp,
              text: d.text,
              screen_name: d.screen_name
            };
          }).sort(function(a, b) {
            return b.timestamp - a.timestamp;
          });

          return callback(null, sanitized);
        }
      });
    },

    getCountForSpan: function(start, end, callback) {
      tweetsDb.loadDatabase();
      tweetsDb.count(
        {
          $where: function() {
            return (!start || this.timestamp >= start) && (!end || this.timestamp <= end);
          }
        },
        function(err, count) {
          if (err) return callback(err);
          else {
            var result = {
              type: 'count',
              start: start,
              end: end,
              count: count
            };

            return callback(null, result);
          }
        }
      );
    }
  }
};

module.exports = YoloWatch;
