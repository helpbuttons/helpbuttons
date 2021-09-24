import winston from 'winston';
import moment from 'moment';
import DailyRotateFile from 'winston-daily-rotate-file';

const LogConfig = {
    logName: 'hb-back',
    logDirectory: './logs/',
    logDatePattern: 'YYYY-MM-DD',
};

const customFormat = winston.format.combine(
    winston.format.splat(),
    winston.format.simple(),
    winston.format.align(),
    winston.format.printf(
        info =>
            moment().format('DD/MM/YY HH:mm:ss') + ':  ' + info.level + ': ' +
            info.message
    ),
);
export const logger = winston.createLogger({
    format: winston.format.combine(customFormat),
    exitOnError: false,
    transports: [
        new winston.transports.Console(),
        new DailyRotateFile({
            filename: LogConfig.logDirectory + LogConfig.logName + '.log',
            datePattern: LogConfig.logDatePattern,
            zippedArchive: true,
        }),
    ]
});