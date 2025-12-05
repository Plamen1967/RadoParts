import { AfterViewInit, Component, DestroyRef, Input, OnInit, Renderer2 } from '@angular/core'
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

@Component({
    standalone: true,
    selector: 'app-dealerwebpage',
    templateUrl: './dealerWebPage.component.html',
    styleUrls: ['./dealerWebPage.component.css'],
    imports: [FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
})
export class DealerWebPageComponent implements OnInit, AfterViewInit {
    @Input() userId = 0
    user?: UserView
    id = 0
    url: string
     dataManager?: DataManager
        
    constructor(
        private activeRoute: ActivatedRoute,
        private router: Router,
        private searchPartService: SearchPartService,
        private homeService: HomeService,
        private destroyRef: DestroyRef,
        public loggerService: LoggerService,
        private renderer: Renderer2,

    ) {
        const userId = this.activeRoute.snapshot.paramMap.get('userId')
        if (userId) this.userId = +userId
        this.url = this.activeRoute.snapshot.url.toString()
        console.log(this.activeRoute.snapshot)
        this.renderer.addClass(document.body, 'user-color');
    }

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
        this.router.navigate(['details'],    { queryParams: {userId :this.userId}, relativeTo: this.activeRoute })
    }

    stock() {
        this.router.navigate(['stock'],    { queryParams: {userId :this.userId}, relativeTo: this.activeRoute })
    }

    contact() {
        this.router.navigate(['contact'],    { queryParams: {userId :this.userId}, relativeTo: this.activeRoute })
    }
}
