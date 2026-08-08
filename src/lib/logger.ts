import { LOG_DIR } from '@/config/app';
import { env } from '@/env';
import * as fs from 'fs';
import winston, { createLogger, format } from 'winston';
import 'winston-daily-rotate-file';
import DailyRotateFile from 'winston-daily-rotate-file';

const isDevelopment = (env.NODE_ENV ?? 'production') === 'development';

const noopLogger = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {}
};

const logger = isDevelopment
  ? (() => {
      const logDir: string = LOG_DIR;

      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }

      const fileTransport = new DailyRotateFile({
        filename: `${logDir}/%DATE%-results.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '3d',
        level: 'info'
      });

      return createLogger({
        level: 'debug',
        format: format.combine(
          format.timestamp({
            format: 'DD-MM-YYYY HH:mm:ss'
          }),
          format.json()
        ),
        transports: [
          fileTransport,
          new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(winston.format.colorize(), winston.format.simple())
          })
        ]
      });
    })()
  : noopLogger;

export default logger;
