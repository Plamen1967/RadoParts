import { Component, ElementRef, HostBinding, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { CustomSelectComponent } from '../customSelect.component';
import { TopService } from '@services/top.service';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { SelectBase } from '@components/custom-controls/selectBase';
import { CompanyService } from '@services/company-model-modification/company.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogData } from '@model/dialogData';
import { InternalValue } from '@model/internalValue';
@Component({
  standalone: true,
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css'],
  imports: [NgIf, NgClass, FormsModule, NgFor, MatDialogContent, MatDialogClose]
})
export class CompanyComponent extends SelectBase implements OnInit {

  //#region members
  value?: number;
  placeHolder?: string;
  @ViewChild(CustomSelectComponent) customSelect?: CustomSelectComponent;
  @HostBinding('style:display') flex = 'flex';

  @Input() useFilter = false;;
  //#endregion
  constructor(private topService: TopService, private companyService: CompanyService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public dialogRef: MatDialogRef<CompanyComponent>,
    private elem: ElementRef) {
      super();
      this.label = this.topService.property?.label??this.label;
      this.useFilter = this.topService.property?.useFilter??this.useFilter;
    }

  ngOnInit() {
    this._useFilter = true;
    this._data = this.data.data as InternalValue[];
    this.useLetter = this.data.useLetter;
    this.groupSelection = this.data.groupSelection;
    this._value = this.data.value;
    this.multiSelection = this.data.multiSelection;
    this.groupDisabled = this.data.groupDisabled;
    this.placeHolder = this.data.placeHolder?? 'Избери';
  }

  filterChange(value: string) {
    this._filter = value;
    console.log(this._filter);
    this.updateData();
    console.table(this._data);
  }
  override updateData() {
    this.customSelect?.updateData();
  }

  close() {
    return;
  }

  clickItem($event: Event, item:InternalValue) {
    if (!item.isSelectable) return;
    this.value = item.id;
    this.dialogRef.close(this.value);
  }
 }
