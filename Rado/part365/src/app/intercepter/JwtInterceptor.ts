import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "@services/authentication/authentication.service";
import { ClientIdService } from "@services/clientId.service";
import { Observable } from "rxjs";

@Injectable()
export class JwtInterceptor  implements HttpInterceptor{

    constructor(private authenticationService : AuthenticationService,
                private clientIdService: ClientIdService) {}    

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const curentUser = this.authenticationService.currentUserValue;

        if (curentUser && curentUser.token) {
            request = request.clone({ setHeaders: { 
                Authorization: `Bearer ${curentUser.token}`
            }})
        }

        request = request.clone({ setHeaders: { 
            clientId: `${this.clientIdService.clientId}`}})
        
        return next.handle(request);
    }
}
