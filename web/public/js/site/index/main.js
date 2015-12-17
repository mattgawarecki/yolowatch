Api.getStartDate(function(startDate) {
  var formatted = moment(startDate).format('LLL');
  $('.meta-start-date').text(formatted);
});

setInterval(refresh, 1000);


function refreshAllCounter() {
  Api.getAllCounter(function(res) {
    var div = $('.counter[data-type=all]');
    div.find('.counter-count').text(res.count);
    div.find('.counter-frequency').text(res.frequency);
  });
}

function refreshCurrentHourCounter() {
  Api.getCurrentHourCounter(function(res) {
    var div = $('.counter[data-type=current_hour]');
    div.find('.counter-count').text(res.count);
  });
}

function refreshYearCounter() {
  Api.getYearCounter(function(res) {
    var div = $('.counter[data-type=year]');
    div.find('.counter-key').text(res.key);
    div.find('.counter-count').text(res.count);
  });
}

function refreshCurrentMonthCounter() {
  Api.getCurrentMonthCounter(function(res) {
    var div = $('.counter[data-type=current_month]');
    div.find('.counter-count').text(res.count);
  });
}

function refreshHistoricalMonthCounter() {
  Api.getHistoricalMonthCounter(function(res) {
    var div = $('.counter[data-type=historical_month]');
    div.find('.counter-key').text(res.key);
    div.find('.counter-count').text(res.count);
  });
}

function refresh() {
  refreshAllCounter();
  refreshCurrentHourCounter();
  refreshYearCounter();
  refreshCurrentMonthCounter();
  refreshHistoricalMonthCounter();

  $('.loading').forEach(function(f) { f.style.display = 'none'; });
  $('.data').forEach(function(f) { f.style.display = 'block'; });
}
