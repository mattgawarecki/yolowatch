var config = require('./config');
var DataStore = require('nedb');

module.exports = new DataStore({ filename: config.db.file });
