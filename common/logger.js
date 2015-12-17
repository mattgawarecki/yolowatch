var logger = require('winston');
logger.level = process.env.YW_LOG_LEVEL || 'info';
console.log("Log level set to '%s'.", logger.level);

module.exports = logger;
