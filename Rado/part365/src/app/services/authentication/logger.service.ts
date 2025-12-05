import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  logFlag = true;

  log(message: string) {
    if (this.logFlag) console.log(message);
  }

  logError(message: string) {
    if (this.logFlag) console.error(message);
  }
}
