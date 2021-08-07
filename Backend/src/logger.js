const { mkdir, stat } = require('fs').promises;
const { basename, extname, join } = require('path');
const { performance } = require('perf_hooks');
const winston = require('winston');
require('winston-daily-rotate-file');

const { logsDir } = require('./config/config');

async function createLogsDir() {
    try {
        const dirStat = await stat(logsDir);
        if (dirStat.isDirectory()) {
            console.log('Log directory already exists.');
        } else {
            console.log('Log directory either does not exist or is not a directory.');
            await mkdir(logsDir);
        }
    } catch (error) {
        console.error('Could not create log directory:', error);
    }
}

createLogsDir();

const consoleFormatter = winston.format.printf((info) => {
    const { context = { fileName: undefined, functionName: undefined, type: undefined } } = info;
    const hasContext = context.fileName && context.functionName && context.type;
    const hasTimeElapsed = info.timeElapsed !== undefined;
    const timeElapsed = Number(info.timeElapsed).toFixed(3);
    return `${info.timestamp} - ${info.level}${
        hasContext ? ` [${context.fileName} > ${context.functionName} (${context.type})]` : ''}${
        hasTimeElapsed ? ` (${timeElapsed}ms)` : ''}: ${info.message}`
});

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors(),
                consoleFormatter,
                winston.format.colorize({ all: true }),
            ),
            level: 'info'
        }),
        new winston.transports.DailyRotateFile({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors(),
                winston.format.json()
            ),
            filename: join(logsDir, 'backend-%DATE%.log'),
            level: 'info',
            datePattern: 'YYYY-MM-DD-HH',
            maxSize: '20m'
        }),
    ]
});

const routerLogger = logger.child({ context: { type: 'routing' } });

module.exports = {
    logger,
    routerLogger,
    getContext: (fileName, functionName, type) => ({ fileName, functionName, type }),
    getFileNameFromPath: (filePath) => basename(filePath, extname(filePath)),
    getCurrTime: () => performance.now(),
    getTimeElapsed: (prevTime) => performance.now() - prevTime
};
