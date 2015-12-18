var config = require('../common/config');
var winston = require('winston');
winston.level = config.logger.level || 'info';
console.log("Log level set to '%s'.", winston.level);

module.exports = winston;
