var winston = require('winston');

module.exports = function(level) {
  var logger = new winston.Logger({
    level: level || 'info',
    transports: [
      new winston.transports.Console()
    ]
  });
  console.log("Log level set to '%s'.", logger.level);

  return logger;
};
