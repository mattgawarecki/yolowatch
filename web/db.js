var path = require('path');
var DataStore = require('nedb');

module.exports = new DataStore({ filename: path.join(__dirname, '../db') });
