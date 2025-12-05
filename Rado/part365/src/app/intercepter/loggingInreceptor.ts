import { HttpEvent, HttpEventType, HttpHandlerFn, HttpRequest } from '@angular/common/http'
import { inject } from '@angular/core'
import { AuthenticationService } from '@services/authentication/authentication.service'
import { Observable, tap } from 'rxjs'

export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    return next(req).pipe(
        tap((event) => {
            if (event.type === HttpEventType.Response) {
                console.log(req.url, 'returned a response with status', event.status)
            }
        })
    )
}

export function authInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
    // Inject the current `AuthService` and use it to get an authentication token:
    const curentUser = inject(AuthenticationService).currentUserValue;

    if (!curentUser) {
        return next(request)
    }

    if (!curentUser.token)
      return next(request)

    const newRequest = request.clone({
        setHeaders: {
            Authorization: `Bearer ${curentUser.token}`,
        },
    })

    return next(newRequest)
}

// export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
//   const loadingDialogService = inject(LoadingDialogService)
//   loadingDialogService.openDialog();
//   return next(req).pipe(tap(event => {
//     loadingDialogService.hideDialog();
//     if (event.type === HttpEventType.Response) {
//       console.log(req.url, 'returned a response with status', event.status);
//     }
//   }));
// }
