import { NgClass } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ToastService } from '@services/dialog-api/ToastService/toast.service';
import { LocalStorageService } from '@services/storage/localStorage.service';

@Component({
  standalone: true,
  selector: 'app-favourite',
  templateUrl: './favourite.component.html',
  styleUrls: ['./favourite.component.css'],
  imports: [NgClass]
})
export class FavouriteComponent implements OnInit {
   @HostListener('click', ["$event"])
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   click(event: any) {
    event.stopPropagation();
   }

  @Input() set id(value: number | undefined) {
    this._id = value!;
    this.isSaved = this.localStorageService.isSaved(this._id) 
  }
  @Input() positionEnd?: number = 1;

  @Output() unchecked: EventEmitter<number> = new EventEmitter<number>()
    isSaved?: boolean;
    _id = 0;

  constructor(    private localStorageService: LocalStorageService, private toastService: ToastService) { }

  ngOnInit() {
    this.isSaved = this.localStorageService.isSaved(this._id) 
  }

  unsave() {
    this.localStorageService.removeSavedItem(this._id)
    this.unchecked.emit(this._id);
    this.isSaved = this.localStorageService.isSaved(this._id)   
  }

  save() {
    const countSaveItems = this.localStorageService.getSavedItems().length;
    if (countSaveItems >= 10) {
        this.toastService.show("Може да запазите максимум 10 обяви");
        return;
    }

    this.localStorageService.addSavedItem(this._id)
    this.isSaved = this.localStorageService.isSaved(this._id)   
  }
}
