//#region imports
import { inject, Injectable } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router'
import { LoginComponent } from '@app/user/login/login.component'
import { UserType } from '@model/enum/userType.enum'
import { AuthenticationService } from '@services/authentication/authentication.service'
//#endregion
//#region service
@Injectable({ providedIn: 'root' })
//#endregion
export class AuthGuard implements CanActivate {
    //#region variables and services
    private authenticationService = inject(AuthenticationService)
    private router: Router = inject(Router)
    private matModal: MatDialog = inject(MatDialog)
    //#endregion
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user = this.authenticationService.currentUserValue
        if (user) {
            if (['/category', '/subcategory', '/dealersubcategory', '/company', '/model', '/modification', '/users'].includes(state.url)) {
                if (user.dealer == UserType.Admin) {
                    return true
                } else {
                    this.router.navigate(['/'])
                }
            }
            if (state.url === '/checkout')
                if (!user.dealer) {
                    return true
                } else {
                    this.router.navigate(['/'])
                    return false
                }
            else {
                return true
            }
        } else {
            const dialogRef = this.matModal.open(LoginComponent, {
                panelClass: 'custom-container',
            })
            dialogRef.afterClosed().subscribe((result) => {
                if (result === true) {
                    this.router.navigate([`${state.url}`])
                } else {
                    this.router.navigate(['/'])
                }
            })
        }

        return this.router.createUrlTree(['/'])
    }
}
