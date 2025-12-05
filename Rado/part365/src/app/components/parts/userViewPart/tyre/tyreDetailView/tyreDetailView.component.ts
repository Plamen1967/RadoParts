import { Component, Input } from '@angular/core';
import { DataRowComponent } from '@components/custom-controls/dataRow/dataRow.component';
import { HelperComponent } from '@components/custom-controls/helper/helper.component';
import { DisplayPartView } from '@model/displayPartView';
import { ItemType } from '@model/enum/itemType.enum';

@Component({
  standalone: true,
  selector: 'app-tyredetailview',
  templateUrl: './tyreDetailView.component.html',
  styleUrls: ['./tyreDetailView.component.css'],
  imports: [DataRowComponent]
})
export class TyreDetailViewComponent extends HelperComponent {

  size?: string;
  item!: DisplayPartView;
  isTyre?: boolean;
  isRim?: boolean;

  @Input() set tyre(value: DisplayPartView) {
    this.item = value;
    this.isTyre = this.item.itemType == ItemType.Tyre || this.item.itemType == ItemType.RimWithTyre;
    this.isRim = this.item.itemType == ItemType.Rim || this.item.itemType == ItemType.RimWithTyre;
    this.size = `${this.item.tyreWidthName}/${this.item.tyreHeightName}/R${this.item.tyreRadiusName}`
  };

  get tyre() {
    return this.item;
  }

  get itemType() {
    return this.item.itemType;
  }

  get companyName() {
    return this.item.companyName + (this.item.modelName ?? '');
  }

  constructor() {
    super();
  }

}
