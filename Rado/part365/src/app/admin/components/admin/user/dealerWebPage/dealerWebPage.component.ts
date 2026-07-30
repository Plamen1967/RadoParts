//#region imports
import { AfterViewInit, Component, DestroyRef, inject, Input, OnInit, ChangeDetectionStrategy } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { ActivatedRoute, Router, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router'
import { User } from '@model/user'
import { FormsModule } from '@angular/forms'
import { SearchPartService } from '@services/searchPart.service'
import { Filter } from '@model/filters/filter'
import { SearchBy } from '@model/enum/searchBy.enum'
import { HomeService } from '@services/home.service'
import { LoggerService } from '@services/authentication/logger.service'
import { UserView } from '@model/userView'
import { DataManager } from '@model/dataManager'
//#endregion
// #region component
@Component({
    selector: 'app-dealerwebpage',
    templateUrl: './dealerWebPage.component.html',
    styleUrls: ['./dealerWebPage.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
})
//#endregion
export class DealerWebPageComponent implements OnInit, AfterViewInit {
    //#region variables and services
    @Input() userId = 0
    user?: UserView
    id = 0
    url = ''
    dataManager?: DataManager
    //#region services
    private activeRoute = inject(ActivatedRoute)
    private router = inject(Router)
    private searchPartService = inject(SearchPartService)
    private homeService = inject(HomeService)
    private destroyRef = inject(DestroyRef)
    public loggerService = inject(LoggerService)
    //#endregion
    //#endregion

    ngOnInit() {
        this.activeRoute.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            this.userId = params['userId']
            if (!this.homeService.getDataManager(+this.userId)) {
                const filter: Filter = { id: 0, userId: this.userId, searchBy: SearchBy.Filter, bus: -1 }
                filter.userId = this.userId
                this.searchPartService
                    .search(filter)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe({
                        next: (res) => {
                            this.homeService.addDataManager(this.userId!, res)
                            this.dataManager = this.homeService.getDataManager(this.userId!)
                            if (res.userView) {
                                this.user = { ...res.userView }
                                this.loadUser(this.user)
                            }
                        },
                        error: (error) => {
                            this.loggerService.logError(error)
                            return
                        },
                        complete: () => {
                            return
                        },
                    })
            }
        })
    }

    loadUser(user: User) {
        this.user = user
        return
    }

    ngAfterViewInit() {
        return
    }

    begin() {
        this.router.navigate(['details'], { queryParams: { userId: this.userId }, relativeTo: this.activeRoute })
    }

    stock() {
        this.router.navigate(['stock'], { queryParams: { userId: this.userId }, relativeTo: this.activeRoute })
    }

    contact() {
        this.router.navigate(['contact'], { queryParams: { userId: this.userId }, relativeTo: this.activeRoute })
    }
}
