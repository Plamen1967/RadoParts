import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { LoggerService } from '@services/authentication/logger.service'
import { throwError } from 'rxjs/internal/observable/throwError'
import { catchError } from 'rxjs/internal/operators/catchError'

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private loggerService: LoggerService) {}

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
