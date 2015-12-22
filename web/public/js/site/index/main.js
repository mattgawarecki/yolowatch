refreshRecent();

startCounters(function(counters) {
  refreshCounters(counters, function() {
    $('.loading').addClass('hidden');
    $('.data').removeClass('hidden');

    setInterval(function() {
      refreshRecent();
      refreshCounters(counters);
    }, 3000);
  });
});

function startCounters(onStarted) {
  Api.getStartDate(function(d) {
    var formattedDate = moment(d).format('LL');
    $('.start-date').text(formattedDate);
    enableCounters(d, function(enabledCounters) {
      // Refresh all enabled counters; when finished, notify the page
      // that all counters have been started
      refreshCounters(enabledCounters, function() {
        onStarted(enabledCounters);
      });
    });
  });
}

function dataPresentForTimeSpan(part, start, end) {
  var startPeriod = moment(start).startOf(part);
  var endPeriod = moment(end).startOf(part);
  return endPeriod > startPeriod;
}

function enableCounters(startDate, onEnabled) {
  var checkSpan = function(part) { return dataPresentForTimeSpan(part, startDate, new Date()); };

  var allCounterStatuses = {
    all: true,
    current_hour: checkSpan('hour'),
    previous_hour: dataPresentForTimeSpan('hour', startDate, moment().subtract(1, 'hour')),
    current_day: checkSpan('day'),
    previous_day: dataPresentForTimeSpan('day', startDate, moment().subtract(1, 'day')),
    current_month: checkSpan('month'),
    current_year: checkSpan('year')
  };

  // Get all the elements with the 'counter' class and key them by counter type
  var allCounterElementsByType = $('.counter').reduce(function(acc, next) {
    var currentCounterType = next.getAttribute('data-type');
    acc[currentCounterType] = $(next);
    return acc;
  }, {});

  // For each counter that should NOT be enabled, add the 'hidden' class to it
  Object.keys(allCounterStatuses).filter(function(c) {
    return !allCounterStatuses[c];
  }).forEach(function(c) {
    allCounterElementsByType[c].addClass('hidden');
  });

  // Continue on, passing the names of the counters the page should keep updated
  var countersToRefresh = Object.keys(allCounterStatuses).filter(function(c) {
    return allCounterStatuses[c];
  });

  onEnabled(countersToRefresh);
}

function refreshCounters(counters, onRefreshed) {
  // Methods used to update each counter
  var allCounterRefreshMethods = {
    all: function() { refreshCounterByName('all'); },
    current_hour: function() { refreshCounterByName('current_hour'); },
    previous_hour: function() { refreshCounterByName('previous_hour'); },
    current_day: function() { refreshCounterByName('current_day'); },
    previous_day: function() { refreshCounterByName('previous_day'); },
    current_month: function() { refreshCounterByName('current_month'); },
    current_year: function() { refreshCounterByName('current_year'); },
  };

  var enabledCounterRefreshMethods = counters.reduce(function(acc, next) {
    acc[next] = function(callback) { allCounterRefreshMethods[next](); callback(null); };
    return acc;
  }, {});

  async.parallel(enabledCounterRefreshMethods, onRefreshed);
}

function refreshCounterByName(name) {
  var methods = {
    all: Api.getAllCounter,
    current_hour: Api.getCurrentHourCounter,
    previous_hour: Api.getPreviousHourCounter,
    current_day: Api.getCurrentDayCounter,
    previous_day: Api.getPreviousDayCounter,
    current_month: Api.getCurrentMonthCounter,
    current_year: Api.getCurrentYearCounter
  };

  methods[name](function(res) {
    var counter = $('.counter[data-type=' + name + '] .counter-count');
    counter.text(res.count);
  });
}

function refreshRecent() {
  console.log('refreshing recent');
  Api.getRecentTweets(function(res) {
    var recentTweets = $('.recent-tweets');
    recentTweets.empty();
    res.forEach(function(t) {
      recentTweets.append(
        '<dt class="tweet-screen-name">@' + t.screen_name + '</dl>' +
        '<dd class="tweet-text">' + t.text + '</dd>'
      );
    });
  });
}
