//#region imports
import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core'
import { Router } from '@angular/router'
import { AuthenticationService } from '@services/authentication/authentication.service'
//#endregion
//#region component
@Component({
    imports: [],
    selector: 'app-addnew',
    templateUrl: './add-new.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./add-new.component.css'],
})
//#endregion
export default class AddNewComponent implements OnInit {
    //#region variables and services
    private router: Router = inject(Router)
    private authenticationService: AuthenticationService = inject(AuthenticationService)
    choices = [
        { name: 'Добави Кола', page: '/data/addPart' },
        { name: 'Добави Част за кола', page: '/data/addpart' },
        { name: 'Добави Част за бус', page: '/data/addpart?bus=1' },
        { name: 'Добави Бус', page: '/data/addCar?bus=true' },
        { name: 'Добави Гуми/Джанти', page: '/data/addTyre' },
    ]
    //#endregion

    ngOnInit() {
        if (!this.seller) this.router.navigate(['/data/addPart'])
    }

    get user() {
        return this.logged
    }

    get seller() {
        return this.logged?.dealer
    }
    get logged() {
        return this.authenticationService.currentUserValue
    }

    addCar() {
        this.router.navigate(['/data/addCar'], { queryParams: { ad: `new` } })
    }
    addBus() {
        this.router.navigate(['/data/addCar'], { queryParams: { ad: `new`, bus: 1 } })
    }
    addCarPart() {
        this.router.navigate(['/data/addPart'], { queryParams: { ad: `new` } })
    }
    addBusPart() {
        this.router.navigate(['/data/addPart'], { queryParams: { ad: `new`, bus: 1 } })
    }
    addTyre() {
        this.router.navigate(['/data/addTyre'], { queryParams: { ad: `new` } })
    }
}
