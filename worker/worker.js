var path = require('path');
var DataStore = require('nedb');
var db = new DataStore({ filename: path.join(__dirname, '../db'), autoload: true });

console.log('Starting worker.');

console.log('Checking database.');
db.findOne({}, function(err, doc) {
  if (!doc) {
    db.insert({ start: new Date(), count: 0 }, function(err, newDoc) {
      if (err) console.log('Error initializing database: ' + err);
      else console.log('Database initialized.');
    });
  } else {
    console.log('Database already initialized.');
  }
})

var Twit = require('twit');
var T = new Twit({
  consumer_key: '7tICA3DnSrUBrazFg5Yip5t7n',
  consumer_secret: process.env.YOLOWATCH_CONSUMER_SECRET,
  access_token: '12466862-J0DwVlDtWPl0dtqrmQAFHOBZwawGTUlwAmP4rTO0p',
  access_token_secret: process.env.YOLOWATCH_ACCESS_TOKEN_SECRET
});

var stream = T.stream('statuses/filter', { track: 'yolo' });
stream.on('tweet', function(tweet) {
  console.log('Tweet received.');

  db.update({}, { $inc: { count: 1 } }, { upsert: true }, function() {
    console.log('Database updated.');
  });

  console.log();
});

// Run forever until the process is killed
