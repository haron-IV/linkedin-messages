const { createLogger, format, transports } = require('winston')
const fs = require('fs');

const customFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} | ${level}: ${message}`;
});

let customFormatFile = null
if (process.env.ENV === 'local') {
  // THIS IS NOT WORKING ON WINDOWS
  const clif = () => fs.readFileSync('logs/logs.log', 'utf8').split('\n').length; //count lines in file

  customFormatFile = format.printf( ({ level, message, timestamp }) => {
    return `{ "i": ${clif()}, "timestamp": "${timestamp}", "level": "${level}", "message": "${message}" },`;
  });
} else {
  customFormatFile = format.printf( ({ level, message, timestamp }) => {
    return `{ "timestamp": "${timestamp}", "level": "${level}", "message": "${message}" },`;
  });
}

const logger = createLogger({
  transports: [
    new transports.File({
      level: "debug",
      maxsize: 5120000,
      maxFiles: 20,
      filename: `logs/logs.log`,
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD ( HH:mm:ss )'
        }),
        customFormatFile
      )
    }),
    new transports.Console({
      level: "debug",
      format: format.combine(
        format.colorize(),
        format.timestamp({
          format: 'YYYY-MM-DD ( HH:mm:ss )'
        }),
        customFormat
      )
    })
  ]
})

module.exports = logger 