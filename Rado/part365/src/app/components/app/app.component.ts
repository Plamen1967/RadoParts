import { NgClass } from '@angular/common'
import { Component } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { RouterOutlet } from '@angular/router'
import { NavMenuComponent } from '@app/menu/navMenu/navMenu.component'
import { FooterComponent } from '@components/header-footer/footer/footer.component'
import { AuthenticationService } from '@services/authentication/authentication.service'
import { LoggerService } from '@services/authentication/logger.service'
import { PathService } from '@services/path.service'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import { UserCountService } from '@services/userCount.service'

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, FooterComponent, NavMenuComponent, NgClass, RouterModule, CommonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'part365'
    opened = false

    constructor(
        private dialog: MatDialog,
        private pathService: PathService,
        private userService: UserCountService,
        private loggerService: LoggerService,
        public authenticationService: AuthenticationService
    ) {
        if (authenticationService.currentToken) {
            this.authenticationService.validateToken().subscribe({
                next: () => {
                    this.userService.refresh()
                    return
                },
                error: (error: string) => {
                    authenticationService.logout()
                    console.log(error)
                },
            })
        }

        const link = document.createElement('meta')
        link.setAttribute('name', 'viewport')
        link.setAttribute('content', 'width=device-width, initial-scale=1.0')
        document.getElementsByTagName('head')[0].appendChild(link)
    }

    get dealerWebaPage() {
        if (this.pathService.userPage) return true
        return false
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onActivate(e: unknown, outlet: any) {
        outlet.scrollTop = 0
    }
    // onActivate(, outlet){
    // outlet.scrollTop = 0;) {

    //     // window.scroll({
    //     //         top: 0,
    //     //         left: 0,
    //     //         behavior: 'smooth'
    //     //     });
    //     document.querySelector('body')?.scrollTo(0,0)
    //     console.log('activate');
    //     //document.body.scrollTop = 0;
    //     // const scrollToTop = window.setInterval(() => {
    //     //     const pos = window.pageYOffset
    //     //     if (pos > 0) {
    //     //         window.scrollTo(0, pos - 20) // how far to scroll on each step
    //     //     } else {
    //     //         window.clearInterval(scrollToTop)
    //     //     }
    //     // }, 16)
    // }
}
