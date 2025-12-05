//#region Imports
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { convertDate, positionDescription } from '@app/functions/functions';
import { RowComponent } from '@components/custom-controls/partRow/row.component';
import { HelperComponent } from '@components/custom-controls/helper/helper.component';
import { DealerActionType } from '@model/dealerActionType';
import { UpdateEnum } from '@model/enum/update.enum';
import { PartView } from '@model/part/partView';
import { AuthenticationService } from '@services/authentication/authentication.service';
import { PartServiceService } from '@services/part/partService.service';
import { StaticSelectionService } from '@services/staticSelection.service';
import { Router } from '@angular/router';
import { InfoLine } from '@model/infoLine';

@Component({
  standalone: true,
  selector: 'app-rowpartdealer',
  templateUrl: './rowPartDealer.component.html',
  styleUrls: ['./rowPartDealer.component.css'],
  imports: [RowComponent]
})
//#endregion
export class RowPartDealerComponent extends HelperComponent {
  //#region Input/Output
  engineTypeDesc_?: string;
  gearboxDesc_?: string
  partView_?: PartView;
  positionDesc_?: string;
  modifiedTime_?: string;
  phones_?: string;
  region_?: string;
  lines: InfoLine[] = [];
  description!: string
  
  @Input() set part(val: PartView) {
    this.partView_ = val;
    this.engineTypeDesc_ = this.staticService.engineTypeDescription(this.partView_.engineType!);
    this.gearboxDesc_ = this.staticService.GearboxType.filter(x => x.value === this.partView_?.gearboxType)[0]?.text;
    this.positionDesc_ = positionDescription(this.partView_);
    this.modifiedTime_ = convertDate(this.partView_.modifiedTime!)
    const _phones = [];
    if (this.partView_.sellerPhone) _phones.push(this.partView_.sellerPhone);
    if (this.partView_.sellerPhone2) _phones.push(this.partView_.sellerPhone2);

    this.phones_ = _phones.join('/');
    const index = this.staticService.Region.findIndex(x => x.value === this.partView_?.regionId);
    if (this.partView_ && index !== -1)
      this.region_ = this.staticService.Region.find(x => x.value === this.partView_?.regionId)?.text

    this.generatelines();
  }

  @Input() checkoutId?: number;
  @Input() highlighted?: boolean = false;
  @Input() allowUpdate?: boolean;
  @Output() action = new EventEmitter<DealerActionType>();
  //#endregion
  //#region Members
  //#endregion
  //#region c'tor
  constructor(private staticService: StaticSelectionService,
    private authernticationService: AuthenticationService,
    private router: Router,
    public partService: PartServiceService) {
      super();
  }
  

  //#endregion
  //#region Get Functions
  get partId() {
    return this.partView_?.partId
  }

  get user() {
    return this.authernticationService.currentUserValue;
  }

  get dealer() {
    return this.user?.dealer;
  }

  get engineTypeDesc() {
    return this.engineTypeDesc_;
  }

  get gearboxDesc() {
    return this.gearboxDesc_;
  }

  get positionDesc() {
    return this.positionDesc_;
  }

  get modifiedTime() {
    return this.modifiedTime_;
  }

  get region() {
    return this.region_;
  }

  get phones() {
    return this.phones_;
  }
  //#endregion 
  //#region Actions
  updatePart(partId: number) {
    this.router.navigate(['/data/updatePart'], {queryParams: {carId: this.partView_?.carId, partId: this.partView_?.partId}})
    this.action.emit({ action: UpdateEnum.Update, id: partId, car: false });
  }

  deletePart() {
      this.action.emit({ action: UpdateEnum.Delete, id: this.partView_?.partId, car: false })
  }

  //#endregion

  generatelines() {
    if (!this.partView_) return;
    this.lines = [];
    this.description = `${this.partView_.companyName} ${ this.partView_.modelName } ${ this.partView_.modificationName ?? "" } ${ this.partView_.year }`;
    this.lines.push({label: "Model", value: this.description, price: false});
    if (this.partView_.description)
      this.lines.push({label: this.labels.PART_DETAILS, value: this.partView_.description, price: false});
    if (this.partView_.partNumber)
      this.lines.push({label: this.labels.PART_NUMBER, value: this.partView_.partNumber, price: false});
    if (this.partView_.numberImages)
      this.lines.push({ label: 'Брой снимки', value: this.partView_.numberImages, price: false })
    if (this.partView_.engineType)
      this.lines.push({label: this.labels.TYPE_ENGINE, value: this.engineTypeDesc, price: false});
    if (this.partView_.engineModel)
      this.lines.push({label: this.labels.CODE_ENGINE, value: this.partView_.engineModel, price: false});
    if (this.partView_.gearboxType)
      this.lines.push({label: this.labels.TYPE_GEARBOX, value: this.gearboxDesc, price: false});
    if (this.positionDesc)
      this.lines.push({label: this.labels.POSITION, value: this.positionDesc, price: false});
    if (this.partView_.millage )
      this.lines.push({label: this.labels.MILLAGE, value: this.partView_.millage , price: false});
    if (this.partView_.categoryName )
      this.lines.push({label: this.labels.CATEGORY , value: this.partView_.categoryName , price: false});
    if (this.partView_.regionId )
      this.lines.push({label: this.labels.REGION , value: this.region , price: false});
    if (this.partView_.price )
      this.lines.push({label: this.labels.PRICE , value: this.partView_.price , price: true});
}
}


