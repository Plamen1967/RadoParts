import { Component, Input, OnInit } from '@angular/core'
import { isMobile, viberCallRef, viberChatRef, viberContactRef, viberForwardRef } from '@app/functions/functions';
import { HelperComponent } from '@components/custom-controls/helper/helper.component';
import { ImageService } from '@services/image.service';
import { ImageData } from '@model/imageData';
import { ViberComponent } from '@components/custom-controls/viber/viber.component';
import { WhatsComponent } from '@components/custom-controls/whats/whats.component';
import { StaticSelectionService } from '@services/staticSelection.service';
import { UserView } from '@model/userView';
import { PhoneComponent } from '@components/custom-controls/phone/phone.component';


@Component({
    standalone: true,
    selector: 'app-userheader',
    templateUrl: './userHeader.component.html',
    styleUrls: ['./userHeader.component.css'],
    imports: [ViberComponent, PhoneComponent, WhatsComponent],
})
export class UserHeaderComponent extends HelperComponent implements OnInit{
  @Input({required: true}) user!: UserView;
  businessCardimage?: ImageData;
  phone1 = "";
  phone2 = "";
  viber = "";
  whats?: string;
  description?: string;
  phones?: string;

  refPhone1 = "";
  refPhone2 = "";
  refViberCall = "";
  refViberChat = "";
  refViberContact = "";
  refViberForward = "";
  isMobile = isMobile();
  region = ""

  constructor(    private imageService: ImageService,
        private staticService: StaticSelectionService,
    
  ) {
    super();
  }
  ngOnInit(): void {
    this.description = this.user.description;
    this.businessCardimage = this.user.busimessCard;
    this.setPhones();
    this.getBusinessCars();
    this.region = this.staticService.Region.find(x => x.value === this.user?.regionId)?.text ?? ''
    this.isMobile = true;
            console.log(this.user)
        console.log(this.businessCardimage)
    console.log(this.phones);

  }

    setPhones() {
      if (!this.user) return;
  
      if (this.user.phone && this.user.phone2 && this.user.viber)
        this.phones = `${this.user.phone} , ${this.user.phone2} , ${this.user.viber}`;
      else if (this.user.phone)
        this.phones = `${this.user.phone}`
      else if (this.user.phone2)
        this.phones = `${this.user.phone2}`
  
      this.phone1 = this.user.phone ?? "";
      this.phone2 = this.user.phone2 ?? "";
      this.viber = this.user.viber ?? "";
      this.whats = this.user.whats ?? "";
  
  
      this.refPhone1 = `tel:${this.phone1}`;
      this.refPhone2 = `tel:${this.phone2}`;
      this.refViberCall = viberCallRef(this.viber);
      this.refViberChat = viberChatRef(this.viber);
      this.refViberForward = viberForwardRef(this.viber, this.viber);
      this.refViberContact = viberContactRef(this.viber);
  
    }

    getBusinessCars() {
          this.businessCardimage = this.user.busimessCard;
    }

}
