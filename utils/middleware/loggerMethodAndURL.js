import logger from '../winston/winston_config'

const loggerMethodAndURL = (req, res, next) => {
    logger.info(`METHOD: ${req.method} - Resource: ${req.protocol + '://' + req.get('host') + req.originalUrl}`)
    return next()
};

export default loggerMethodAndURL