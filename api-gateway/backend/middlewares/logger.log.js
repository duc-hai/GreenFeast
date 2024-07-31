const winston = require('winston')
const { combine, timestamp, align, printf } = winston.format
require('winston-daily-rotate-file')

const errorTransport = new winston.transports.DailyRotateFile({
    level: 'error',
    filename: 'logs/error/%DATE%.log', //DATE means that each day will create different log files for each day (because the date pattern below only has days).
    datePattern: 'YYYY-MM-DD', //-HH 
    zippedArchive: true, //Zip old logs files before deleting them
    maxSize: '20m', //The limit for each log file is 20 mb. If it exceeds 20 mb, a new log file will be automatically created.
    maxFiles: '14d' //Delete log within 14 days, meaning the log file only exists for 14 days
})

const userActionTransport = new winston.transports.DailyRotateFile({
    level: 'info',
    filename: 'logs/info/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
})

const logFormat = combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), //format 24 hours 
    align(), //align message // i guess that it's create a tab
    printf(info => `[${info.timestamp}] ${info.message}`), //${info.level}: error
    //Format message by struct [timestamp] [message], in there, message including method, url, error message
) //I define the log to be printed into the log file according to my preferences

const loggerError = winston.createLogger({
    level: 'error',
    format: logFormat,
    transports: [
        // new winston.transports.Console(), //Config logger to print messgage into console screen
        errorTransport,
    ]
})

const loggerInfo = winston.createLogger({
    level: 'info',
    format: logFormat,
    transports: [
        // new winston.transports.Console(), //Config logger to print messgage into console screen
        userActionTransport
    ]
})

module.exports = {
    loggerError,
    loggerInfo
}
