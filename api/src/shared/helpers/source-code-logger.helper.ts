import { Injectable, Logger, LogLevel } from '@nestjs/
@Injectable()
export class SourceCodeLogger extends Logger {
  constructor(context: string, ...args: any[]) {
    super(context, ...args);
  }

  
  private getCallerInfo(): { file: string; line: number } {
    const stack = new Error().stack;
    if (!stack) {
      return { file: 'unknown', line: 0 };
    }
    const stackLines = stack.split('\n');
    for (let i = 2; i < stackLines.length; i++) {
      const line = stackLines[i].trim();
      const match = line.match(/\((.*?):(\d+):\d+\)$/) || line.match(/(.*?):(\d+):\d+$/);
      if (match) {
        const file = match[1];
        const lineNum = parseInt(match[2], 10);
        if (!file.includes('custom-logger') && !file.includes('logger.helper')) {
          return { file, line: lineNum };
        }
      }
    }

    return { file: 'unknown', line: 0 };
  }

  private formatMessage(message: any, ...args: any[]): string {
    const { file, line } = this.getCallerInfo();
    const shortFile = file.split(/[\\/]/).pop() || file;
    const timestamp = new Date().toISOString();
    return `${message} (${shortFile}:${line}) `;
  }

  log(message: any, ...args: any[]) {
    super.log(this.formatMessage(message, ...args), ...args);
  }

  error(message: any, ...args: any[]) {
    super.error(this.formatMessage(message, ...args), ...args);
  }

  warn(message: any, ...args: any[]) {
    super.warn(this.formatMessage(message, ...args), ...args);
  }

  debug(message: any, ...args: any[]) {
    super.debug(this.formatMessage(message, ...args), ...args);
  }

  verbose(message: any, ...args: any[]) {
    super.verbose(this.formatMessage(message, ...args), ...args);
  }
}
