//#region import
import { Component, HostListener, ViewChild, ElementRef, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CONSTANT } from '@app/constant/globalLabels';
import { HelperComponent } from '@components/custom-controls/helper/helper.component';
import { globalStaticData } from '@model/staticData';
import { CarService } from '@services/car.service';
import { CheckOutService } from '@services/checkOut.service';
import { LocalStorageService } from '@services/storage/localStorage.service';
import { UserService } from '@services/user.service';
import { AsyncPipe, DOCUMENT, NgClass, NgIf, NgStyle } from '@angular/common';
import { CompanyHeaderComponent } from '@components/header-footer/companyHeader/companyHeader.component';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '@app/user/login/login.component';
import { ConfirmServiceService } from '@app/dialog/services/confirmService.service';
import { OKCancelOption } from '@app/dialog/model/confirmDialogData';
import { StaticSelectionService } from '@services/staticSelection.service';
import { PartServiceService } from '@services/part/partService.service';
import { Location } from '@angular/common';
import { PathService } from '@services/path.service';
import { UserCount } from '@model/userCount';
import { Observable } from 'rxjs';
import { UserCountService } from '@services/userCount.service';
//#endregion

//#region component
@Component({
  standalone: true,
  imports: [NgStyle, NgClass, RouterLinkActive, RouterLink, NgIf, CompanyHeaderComponent, AsyncPipe],
  selector: 'app-nav-menu',
  templateUrl: 'navmenu.component.html',
  styleUrls: ['navmenu.component.scss'],
})
//#endregion


export class NavMenuComponent extends HelperComponent implements OnDestroy {
  isExpanded = false;
  showMenu = false;
  showCategory = true;
  checoutItems = 0;
  userId? : number =undefined;
  userCompanyName?: string = "";
  dialogLogin = false;
  userPage = true;
  @ViewChild('header', {read: ElementRef}) header?:ElementRef
  userCount$: Observable<UserCount | undefined>;

  constructor(private router: Router,
    private checkOutService: CheckOutService,
    private location: Location,
    private localStorage: LocalStorageService,
    private userService: UserService,
    private carService: CarService,
    private partService: PartServiceService,
    public pathService: PathService,
    private activatedRoute: ActivatedRoute,
    private userCountService: UserCountService,
    @Inject(DOCUMENT) private document: Document,
    
    private matDialog: MatDialog,
    private confirmService: ConfirmServiceService,
    public staticSelectionService: StaticSelectionService,
  ) {
    super();
    checkOutService.checkout.subscribe(() => this.checkoutUpdate())
    userService.userPage.subscribe(userId => {
      this.userId = userId
    })
    this.userPage = this.pathService.userPage;
    this.userCount$ = this.userCountService.userCount$;
  }
  ngOnDestroy(): void {
    throw "TODO"
    //this.confirmationService.close()
  }

  get localStorageItems() {
    return this.localStorage.items
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event) {
    if(this.header && this.header.nativeElement.contains(event['target'])) {
      return
    }

    const elemSelect = document.getElementsByClassName('show-menu')
    Array.from(elemSelect).forEach(elem => {
      elem?.classList.remove('show-menu');
    })
  }  


  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  get user() {
    return this.logged;
  }


  onLoginOk() {
    throw "TODO"
  }
  onLoginCancel() {
    throw "TODO"
  }

  logout() {
    this.confirmService.OKCancel("Съобщение", "Потвърдете, че искате да се излезете").subscribe(result => {
      if (result === OKCancelOption.OK) {
        this.authenticationService.logout();
        this.router.navigate(['/']);
      }
    } )
  }

  messages() {
    this.router.navigate(['/messages']);
  }

  details() {
    this.router.navigate(['/user/userdetails'])
  }

  get checkout() {
    return `${CONSTANT.SAVED} ${this.localStorage.items}`;
  }

  checkoutUpdate() {
    this.checoutItems = this.localStorage.items;
  }

  get count() {
    return this.localStorage.items;
  }

  login() {
    const loginDialogRef = this.matDialog.open(LoginComponent, {
      panelClass: 'custom-container'      
    });
    loginDialogRef.afterClosed().subscribe((response) => {
      console.log(response)

    })
  }

  register() {
    const loginDialogRef = this.matDialog.open(LoginComponent, {
      panelClass: 'custom-container'
        });
    loginDialogRef.afterClosed().subscribe((response) => {
      console.log(response)

    })
  }


  get displayBanner() {
    const value = ((this.router.url == '/') || this.router.url.startsWith('/?')) ? true : false;
    return value;
  }
  updatePassword() {
    throw "TODO"
//    this.modalService.open("passwordDialog");
  }
  get userName() {
    return this.authenticationService.currentUserValue?.userName;
  }

  get admin() {
    return this.authenticationService.admin;
  }

  get exitName() {
    return this.authenticationService.currentUserValue?.userName
  }

  get companyName() {
    return globalStaticData.companyName;
  }
  get isParts365(): boolean {
    return globalStaticData.companyName === 'Parts365';
  }

  addMenu(id: string) {
    this.removeMenu(id)
    const elemSelect = document.getElementById(id)
    if (elemSelect?.classList.contains('show-menu')) {
      elemSelect?.classList.remove('show-menu');
    }
    else {
      elemSelect?.classList.add('show-menu');
    }

  }
  removeMenu(id: string) {
    Array.from( document.getElementsByClassName('show-menu')).forEach(elem => {
      if (id && elem.id !== id) 
        elem?.classList.remove('show-menu');
    })
  }

  get isHome() {
    const isHome = this.router.url === "/" || this.router.url.length === 0;
    return isHome;
  }

  addPart(bus = 0) {
    if (this.seller) {
      this.router.navigate(['/data/addPart'], { queryParams:  { ad: 'new', bus: bus } })
      this.partService.resetCurrentId();
    } else {
      this.userService.numberOfPartsPerUser().subscribe((numberOfParts) => {
        console.log(numberOfParts);
        // if (numberOfParts.car >= this.staticSelectionService.maxNumberParts) {
        //   this.confirmationService.funcOk = this.onOk.bind(this);
        //   this.confirmationService.open("Съобщение", `Вие достигнахте лимита от ${this.staticSelectionService.maxNumberParts} части.`);
        // } else {
          this.router.navigate(['/data/addPart'], { queryParams:  { ad: 'new' } })
          this.partService.resetCurrentId();
      });
    }
  }

  onOk() {
    // this.confirmationService.close();
    this.router.navigate(['/data/parts'])
    this.partService.resetCurrentId();
    throw "TODO"
}
  
bus() {
  this.router.navigate(['/data/bus'])
  this.carService.resetCurrentId();
}
cars() {
  this.router.navigate(['/data/cars'])
  this.carService.resetCurrentId();
}
parts() {
    this.router.navigate(['/data/parts'])
    this.partService.resetCurrentId();
  }
  rims() {
    this.router.navigate(['/data/rims'])
    this.carService.resetCurrentId();
  }
  tyres() {
    this.router.navigate(['/data/tyres'])
    this.carService.resetCurrentId();
  }
  rimWithTyre() {
    this.router.navigate(['/data/rimWithtyres'])
    this.carService.resetCurrentId();
  }

}
