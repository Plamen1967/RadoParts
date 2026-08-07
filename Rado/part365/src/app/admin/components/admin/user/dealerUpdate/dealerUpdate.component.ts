//#region imports
import { ActivatedRoute, Router } from '@angular/router'
import { first } from 'rxjs/operators'
import { PopUpService } from '@app/dialog/services/popUpService.service'
import { Component, inject, OnInit } from '@angular/core'
import { AuthenticationService } from '@services/authentication/authentication.service'
import { UserService } from '@services/user.service'
import { AlertService } from '@services/alert.service'
import { StaticSelectionService } from '@services/staticSelection.service'
import { ImageService } from '@services/image.service'
import { QueryParam } from '@model/queryParam'
import UpdateUserComponent from '@app/admin/components/admin/updateUser/updateUser.component'
//#endregion
//#region component
@Component({
    selector: 'app-dealerupdate',
    templateUrl: './dealerUpdate.component.html',
    styleUrls: ['./dealerUpdate.component.css'],
    imports: [UpdateUserComponent],
})
//#endregion
export default class DealerUpdateComponent implements OnInit {
    //#region services and variables
    private router: Router
    private authenticationService: AuthenticationService
    private userService: UserService
    private popUpService: PopUpService
    private alerService: AlertService
    public staticSelectionService: StaticSelectionService
    public imageService: ImageService
    private route: ActivatedRoute
    //#endregion
    //#region variables
    activationcode?: string
    userId?: number
    //#endregion

    constructor() {
        this.router = inject(Router)
        this.authenticationService = inject(AuthenticationService)
        this.userService = inject(UserService)
        this.popUpService = inject(PopUpService)
        this.alerService = inject(AlertService)
        this.staticSelectionService = inject(StaticSelectionService)
        this.imageService = inject(ImageService)
        this.route = inject(ActivatedRoute)
    }

    ngOnInit() {
        this.route.params.subscribe((params: QueryParam) => {
            if (params.activationcode) {
                this.activationcode = params.activationcode
                this.userService
                    .loadUserByActivationCode(this.activationcode)
                    .pipe(first())
                    .subscribe((user) => {
                        if (!user) this.router.navigate(['/'])
                        else {
                            this.userId = user.userId
                        }
                    })
            }
        })
    }
}
