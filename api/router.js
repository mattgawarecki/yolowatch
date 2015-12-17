var async = require('async');
var logger = require('../common/logger');

var express = require('express');
var YoloWatch = require('./models/yolowatch');

var router = express.Router();

router.get('/meta', function(req, res) {
  YoloWatch.getMeta(function(err, data) {
    return res.json(data);
  });
});

router.get('/counters/all', function(req, res) {
  YoloWatch.getCounter({ type: 'all' }, function(err, data) {
    return res.json(data);
  });
});

router.get('/counters/year/:year', function(req, res, next) {
  var key = {
    type: 'year',
    key: {
      'year': parseInt(req.params.year)
    }
  };

  YoloWatch.getCounter(key, function(err, data) {
    return res.json(data);
  });
});

router.get('/counters/month/:month', function(req, res, next) {
  var key = {
    type: 'month',
    'key.month': parseInt(req.params.month)
  };

  YoloWatch.getCounters(key, function(err, data) {
    return res.json(data);
  });
});

router.get('/counters/month/:year/:month', function(req, res, next) {
  var key = {
    type: 'month',
    key: {
      year: parseInt(req.params.year),
      month: parseInt(req.params.month)
    }
  };

  YoloWatch.getCounter(key, function(err, data) {
    return res.json(data);
  });
});

router.get('/counters/detail/:year/:month/:date/:hour', function(req, res, next) {
  var key = {
    type: 'hour',
    key: {
      year: parseInt(req.params.year),
      month: parseInt(req.params.month),
      date: parseInt(req.params.date),
      hour: parseInt(req.params.hour)
    }
  };

  YoloWatch.getCounter(key, function(err, data) {
    return res.json(data);
  });
});

module.exports = router;
