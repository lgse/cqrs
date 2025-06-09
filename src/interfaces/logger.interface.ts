export interface ILogger {
  error(message: string, trace?: string, context?: string): void;
  log(message: string, context?: string): void;
  warn(message: string, context?: string): void;
}
