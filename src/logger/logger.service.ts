import { Logger } from 'tslog';

export class LoggerService {
  public logger!: Logger;

  constructor() {
    this.logger = new Logger({
      displayInstanceName: false,
      displayLoggerName: false,
      displayFilePath: 'hidden',
      displayFunctionName: false
    });
  }
  // This methods kind of decorators 

  log(...args: unknown[]) {
    // and we can implement any logic between log prints
    this.logger.info(...args);
  }

  error(...args: unknown[]) {
    this.logger.error(...args);
  }

  warn(...args: unknown[]) {
    this.logger.warn(...args);
  }
  
}
