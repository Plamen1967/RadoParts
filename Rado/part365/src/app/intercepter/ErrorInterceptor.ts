//#region imports
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { LoggerService } from '@services/authentication/logger.service'
import { throwError } from 'rxjs/internal/observable/throwError'
import { catchError } from 'rxjs/internal/operators/catchError'
//#endregion

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    private loggerService: LoggerService = inject(LoggerService)
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req).pipe(
            catchError((err) => {
                this.loggerService.logError(err)
                return throwError(() => err)
            })
        )
    }
}
