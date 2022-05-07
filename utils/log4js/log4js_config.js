let log4js = require('log4js')

log4js.configure({
    appenders: {
        console: { type: 'console' },
        debugFile: { type: 'file', filename: './logs/debug.log' },
        warnFile: { type: 'file', filename: './logs/warn.log' },
        errorFile: { type: 'file', filename: './logs/error.log' },
        loggerConsole: { type: 'logLevelFilter', appender: 'console', level: 'info' },
        loggerDebugFile: { type: 'logLevelFilter', appender: 'debugFile', level: 'debug' },
        loggerWarnFile: { type: 'logLevelFilter', appender: 'warnFile', level: 'warn' },
        loggerErrorFile: { type: 'logLevelFilter', appender: 'errorFile', level: 'error' },
    },
    categories: {
        default: { appenders: ['loggerConsole'], level: 'all' },
        development: { appenders: ['loggerConsole'], level: 'all' },
        production: { appenders: ['loggerConsole', 'loggerErrorFile'], level: 'all' }
    }
})

const logger = log4js.getLogger(process.env.NODE_ENV == 'PROD' ? 'production' : 'development')

module.exports = {logger}