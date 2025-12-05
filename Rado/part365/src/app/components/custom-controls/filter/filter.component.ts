import { Component, ElementRef, HostBinding, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from '@model/dialogData';
import { Filter } from '@model/filters/filter';
import { SelectionItem } from '@model/selectionItem';
import { SaveSearchService } from '@services/saveSearch.service';

@Component({
  standalone: true,
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  imports: [ MatDialogContent, MatDialogClose]
})
export class FilterComponent implements OnInit {
    //#region members
    value?: string
    placeHolder?: string
    data: Filter[] = [];
    selectedId? : number; 
    keywords: Map<string, string> = new Map<string, string>();
    @HostBinding('style:display') flex = 'flex'
    //#endregion
    constructor(
        @Inject(MAT_DIALOG_DATA) public dialogData: DialogData,
        public dialogRef: MatDialogRef<FilterComponent>,
        public saveSearch: SaveSearchService,
        private elem: ElementRef
    ) {
    }

    ngOnInit() {
        this.placeHolder = 'Избери предишно търсене'
        this.data = this.saveSearch.getSavedItems();
    }

    getKeyWords(keywords?: Map<string, string>) {
      return keywords;
    }
    close() {
        this.dialogRef.close(this.selectedId)
        return
    }

    clickItem($event: Event, item: SelectionItem) {
      this.dialogRef.close(item.id)
      return
  }
}
