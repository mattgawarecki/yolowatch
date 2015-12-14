var YoloWatch = require('./models/yolowatch');

module.exports = function(app) {
  app.get('/data', function(req, res) {
    YoloWatch.getData(
      function(err) { console.error(err); },
      function(data) { res.json(data); }
    );
  });

  app.get('/', function(req, res) {
    res.render('index');
  });
}
