function _requestApiData(path, callback) {
  superagent.get('/api' + path).end(function(err, res) {
    return callback(res.body);
  });
}

var Api = {
  getStartDate: function(callback) {
    _requestApiData('/meta/start_date', function(res) {
      callback(res.data.start_date);
    });
  },
  getAllCounter: function(callback) {
    _requestApiData('/count', function(res) {
      return callback({
        count: res.data.count
      });
    });
  },
  getCurrentHourCounter: function(callback) {
    var now = moment();

    var route = '/count/since/' + now.startOf('hour').valueOf();
    _requestApiData(route, function(res) {
      return callback({
        count: res.data.count
      });
    });
  },
  getPreviousHourCounter: function(callback) {
    var from = moment().startOf('hour').subtract(1, 'hour').valueOf();
    var to = moment().startOf('hour').valueOf();

    var route = '/count/from/' + from + '/to/' + to;
    _requestApiData(route, function(res) {
      return callback({
        count: res.data.count
      });
    });
  },
  getCurrentDayCounter: function(callback) {
    _requestApiData('/count/since/' + moment().startOf('day').valueOf(), function(res) {
      return callback({
        count: res.data.count
      });
    });
  },
  getPreviousDayCounter: function(callback) {
    var from = moment().startOf('day').subtract(1, 'day').valueOf();
    var to = moment().startOf('day').valueOf();

    var route = '/count/from/' + from + '/to/' + to;
    _requestApiData(route, function(res) {
      return callback({
        count: res.data.count
      });
    });
  },
  getCurrentMonthCounter: function(callback) {
    _requestApiData('/count/since/' + moment().startOf('month').valueOf(), function(res) {
      return callback({
        count: res.data.count
      });
    });
  },
  getCurrentYearCounter: function(callback) {
    _requestApiData('/count/since/' + moment().startOf('year').valueOf(), function(res) {
      return callback({
        count: res.data.count
      });
    });
  }
};
