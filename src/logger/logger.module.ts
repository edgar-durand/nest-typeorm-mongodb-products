import {
  Global,
  Logger,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston/dist/winston.utilities';
import { TransformableInfo } from 'logform';
import { LoggerMiddleware } from './logger.middleware';
import DailyRotateFile = require('winston-daily-rotate-file');

const dailyTransport = new DailyRotateFile({
  filename: '%DATE%.log',
  dirname: 'logs',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    nestWinstonModuleUtilities.format.nestLike(),
  ),
});

const { format } = winston;
const logFormat = format.printf((info: TransformableInfo) => {
  return `${info.timestamp} ${
    process.env.ENV_NAME
  }: ${info.level.toUpperCase()}: ${info.message}`;
});

const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    format.timestamp(),
    logFormat,
    nestWinstonModuleUtilities.format.nestLike(),
  ),
});

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [dailyTransport, consoleTransport],
    }),
  ],
  providers: [Logger],
  controllers: [],
  exports: [Logger],
})
export class LoggerModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
