import { ActivatedRoute, Router } from '@angular/router'
import { first } from 'rxjs/operators'
import { PopUpServiceService } from '@app/dialog/services/popUpService.service'
import { Component, OnInit } from '@angular/core'
import { AuthenticationService } from '@services/authentication/authentication.service'
import { UserService } from '@services/user.service'
import { AlertService } from '@services/alert.service'
import { StaticSelectionService } from '@services/staticSelection.service'
import { ImageService } from '@services/image.service'
import { QueryParam } from '@model/queryParam'
import UpdateUserComponent from '@components/custom-controls/admin/updateUser/updateUser.component'

@Component({
    standalone: true,
    selector: 'app-dealerupdate',
    templateUrl: './dealerUpdate.component.html',
    styleUrls: ['./dealerUpdate.component.css'],
    imports: [UpdateUserComponent],
})
export default class DealerUpdateComponent implements OnInit {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private popUpService: PopUpServiceService,
        private alerService: AlertService,
        public staticSelectionService: StaticSelectionService,
        public imageService: ImageService,
        private route: ActivatedRoute
    ) {}
    activationcode?: string
    userId?: number

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
