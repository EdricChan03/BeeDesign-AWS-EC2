const route = require('./routes');
const { logger, getContext, getCurrTime, getFileNameFromPath, getTimeElapsed } = require('./logger');

module.exports = (app, router) => {
    const currTime = getCurrTime();
    const context = getContext(getFileNameFromPath(__filename), 'bootstrap', 'route');
    logger.info('Bootstrapping the routes...', { context, timeElapsed: getTimeElapsed(currTime) });
    route.appRoute(router);
    logger.info('Done bootstrapping the routes.', { context, timeElapsed: getTimeElapsed(currTime) });
};
