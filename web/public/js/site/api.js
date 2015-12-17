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
    _requestApiData('/counters/all', function(counter) {
      Api.getStartDate(function(startDate) {
        var minutes = moment.duration(moment() - moment(startDate)).asMinutes();
        var timesPerMinute = counter.data.count / minutes;

        return callback({
          start_date: moment(startDate).toDate(),
          count: counter.data.count,
          frequency: timesPerMinute
        });
      });
    });
  },
  getCurrentHourCounter: function(callback) {
    var now = moment().utc();

    var route = '/counters/detail/' +
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
  getYearCounter: function(callback) {
    var now = moment();
    _requestApiData('/counters/year/' + now.utc().year(), function(res) {
      return callback({
        key: now.local().year(),
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
  }
};
