function _requestApiData(path, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', encodeURI('/api' + path));
  xhr.onload = function() {
    var response = JSON.parse(xhr.response);
    callback(response);
  };
  xhr.send();
}

var Api = {
  getStartDate: function(callback) {
    _requestApiData('/meta', function(res) {
      callback(res.data.start_date);
    });
  },
  getAllCounter: function(callback) {
    _requestApiData('/counters/all', function(res) {
      return callback({
        count: res.data.count
      });
    });
  },
  getCurrentHourCounter: function(callback) {
    var now = moment().utc();

    var route = '/counters/hour/' +
      now.year() + '/' +
      (now.month() + 1) + '/' +
      now.date() + '/' +
      now.hour();
    _requestApiData(route, function(res) {
      return callback({
        count: res.data.count
      });
    });
  },
  getPreviousHourCounter: function(callback) {
    var now = moment().subtract(1, 'hour').utc();

    var route = '/counters/hour/' +
      now.year() + '/' +
      (now.month() + 1) + '/' +
      now.date() + '/' +
      now.hour();
    _requestApiData(route, function(res) {
      return callback({
        count: res.data.count
      });
    });
  },
  getCurrentDayCounter: function(callback) {
    var now = moment().utc();
    var year = now.year();
    var dayOfYear = now.dayOfYear();
    _requestApiData('/counters/date/' + year + '/' + dayOfYear, function(res) {
      return callback({
        count: res.data.count
      });
    });
  },
  getPreviousDayCounter: function(callback) {
    var now = moment().subtract(1, 'day').utc();
    var year = now.year();
    var dayOfYear = now.dayOfYear();
    _requestApiData('/counters/date/' + year + '/' + dayOfYear, function(res) {
      return callback({
        count: res.data.count
      });
    });
  },
  getCurrentMonthCounter: function(callback) {
    var now = moment();
    var year = now.utc().year();
    var month = now.utc().month() + 1;
    _requestApiData('/counters/month/' + year + '/' + month, function(res) {
      return callback({
        count: res.data.count
      });
    });
  },
  getCurrentYearCounter: function(callback) {
    var now = moment();
    _requestApiData('/counters/year/' + now.utc().year(), function(res) {
      return callback({
        key: now.local().year(),
        count: res.data.count
      });
    });
  }
};
