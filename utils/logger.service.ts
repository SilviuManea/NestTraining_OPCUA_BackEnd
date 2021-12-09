import { LoggerService as LS } from '@nestjs/common';
import { createLogger, format, Logger, transports } from 'winston';
import 'winston-daily-rotate-file';

/*    const myCustomLevels = {
  levels: {
    log: 0,
    error: 1,
    info: 2,
    warning: 3,
    connection: 4,
  },
  colors: {
    log: 'orange',
    info: 'blue',
    warning: 'green',
    error: 'yellow',
    connection: 'red',
  },
}; 
 */
export class LoggerService implements LS {
  private logger: Logger;  // Used for the default logger

  private MyCustomLogger: Logger; // Used for the Custom logger (Specific things we want to log)

  constructor() {
    const myFormat = format.printf((info) => {
      return `${info.timestamp} - ${info.message}`;
    });

    //Creating my custom logger for logging connections to AGV status only
    this.MyCustomLogger = createLogger({
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss', // Optional for choosing your own timestamp format.
        }),
        myFormat,
      ),
      transports: [
        new transports.DailyRotateFile({
          filename: 'log/connection/connection-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          level: 'info',
        }),
      ],
    });

    this.logger = createLogger({
      // level: config.logLevel,
      // level: 'error',
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss', // Optional for choosing your own timestamp format.
        }),
        //format.colorize(myCustomLevels),
        myFormat,
      ),
      transports: [
        // Error
        new transports.DailyRotateFile({
          filename: 'log/errors/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          level: 'error',
        }),
        new transports.DailyRotateFile({
          filename: 'log/all/all-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
        }),
        new transports.DailyRotateFile({
          filename: 'log/info/info-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          level: 'info',
        }),
        new transports.Console(),
      ],
    });

    console.log = (message: any, params?: any) => {

      if(params){

        this.logger.info(message + " " + JSON.stringify(params));
        
        }else{
        
        this.logger.info(message);
        
        }
      //this.logger.info(message, JSON.stringify(params));
    };
    console.error = (message: any, params?: any) => {
      
      if(params){

        this.logger.info(message + " " + JSON.stringify(params));
        
        }else{
        
        this.logger.info(message);
        
        }
      
      //this.logger.error(message, params);
    };
  }

  //Custom function we added to log only the connections and disconnections of the AGV/PLC
  logConnection(message: string, trace?: string) {
    this.MyCustomLogger.info(message);
  }

  log(message: string) {
    this.logger.info(message);
  }
  error(message: string, trace: string) {
    this.logger.error(message, trace);
  }
  warn(message: string) {
    this.logger.warning(message);
  }
  debug(message: string) {
    this.logger.debug(message);
  }
  verbose(message: string) {
    this.logger.verbose(message);
  }
}
