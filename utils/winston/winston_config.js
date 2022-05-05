import { createLogger, format, transport } from 'winston';

const { combine, timestamp, prettyPrint } = format;


// log only the messages the match 'level'

function filterOnly(leve) {
    return format(function (info) {
        if (info[LEVEL] === level) {
            return info ;
        }
    })();
}

const loggerDevelopment = {
    level: 'development',
    transports: [
        new transport.Console({
            format: combine(
                prettyPrint()
            ),
            level: 'info'
        })
    ]
}

const loggerProduction = {
    level: 'production',
    transports: [
        new transports.File({
            filename: './logs/winston_warn_log',
            format: combine(
                filterOnly('warn'),
                timestamp(),
                prettyPrint(),
            ),
            level: 'warn'
        }),
        new transports.File({
            filename: './logs/winston_error_log',
            format: combine(
                filterOnly('error'),
                timestamp(),
                prettyPrint(),
            ),
            level: 'error'
        })
    ]
}

const logger = process.env.NODE_ENV == 'PROD' ? createLogger(loggerProduction) : createLogger(loggerDevelopment)

export default logger;