import { Component, DestroyRef, OnInit, Optional } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxGalleryImage } from '@app/ngx-gallery/models/ngx-gallery-image.model';
import { ImageCarouselComponent } from '@components/custom-controls/image-carousel/image-carousel.component';
import { DataManager } from '@model/dataManager';
import { SearchBy } from '@model/enum/searchBy.enum';
import { Filter } from '@model/filters/filter';
import { User } from '@model/user';
import { UserView } from '@model/userView';
import { LoggerService } from '@services/authentication/logger.service';
import { HomeService } from '@services/home.service';
import { SearchPartService } from '@services/searchPart.service';
import { UserService } from '@services/user.service';
import { ImageData } from '@model/imageData'
import { convertImage } from '@app/functions/functions';
import { DealerWebPageComponent } from '@app/user/dealerWebPage/dealerWebPage.component';

@Component({
  standalone: true,
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  imports: [ImageCarouselComponent]
})
export default class DetailsComponent implements OnInit {

  userId!: number
      user?: UserView
      id = 0
       dataManager?: DataManager
      images2: NgxGalleryImage[] = []
      images?: ImageData[]
      description = "";
  
  constructor(
        private userService: UserService,
        private activeRoute: ActivatedRoute,
        private router: Router,
        private searchPartService: SearchPartService,
        private homeService: HomeService,
        private destroyRef: DestroyRef,
        public loggerService: LoggerService,
        @Optional() public parent: DealerWebPageComponent

  ) { 
    this.user = parent.user;
    if (this.user) this.loadUser(this.user);
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
        this.description = this.user.description ?? "";
        if (this.description.length == 0) {
          this.description = "Нашата момпания е създадена през 1996 г. Ние сме специализирани в разгловяване и рециклиранио на части за всички видове коли и автобуси."
        }
      this.images = user.images
        const images_: NgxGalleryImage[] = []
        this.images?.forEach((image) => {
            const convertedImage = convertImage(image)
            if (convertedImage) {
                images_.push(convertedImage)
            }
        })
        this.images2 = [...images_]
            return
    }


}
