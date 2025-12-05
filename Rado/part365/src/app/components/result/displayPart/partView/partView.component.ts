import { Component, Input, Output, EventEmitter } from '@angular/core';
import { HelperComponent } from '@components/custom-controls/helper/helper.component';
import { DisplayPartView } from '@model/displayPartView';
import { StaticSelectionService } from '@services/staticSelection.service';

@Component({
  standalone: true,
  selector: 'app-partview',
  templateUrl: './partView.component.html',
  styleUrls: ['./partView.component.css'],
  imports: []
})
export class PartViewComponent extends HelperComponent {

  _viewPart?: DisplayPartView;
  modification?: string;
  carModel?: string;
  year?: string;
  position?: string;
  fields = ["Двигател", "Скоростна кутия", "Вид двигател", "Номер на частта", "Код двигател", "Позиция", "Мощност", "VIN", "Пробег"]
  @Output() view = new EventEmitter();   
  @Input() set part(value: DisplayPartView) {
    this._viewPart = value;
  }
  get part() : DisplayPartView {
    return this._viewPart!;

  }
  constructor(private staticService: StaticSelectionService) { 
    super() 
  }


  viewItem() {
    this.view.emit();
  }

  get line() {
    if (!this._viewPart || !this._viewPart.tags) 
      return undefined

    const mapTags = new Map(Object.entries(this._viewPart.tags));
      // this._viewPart.tags.flatMap(({k, v}) => ["Двигател", "Вид двигател"].includes(k) ? [v] : [] );
      const items = [...mapTags].filter(([k, ]) => { 
        if (this.fields.includes(k)) 
          return true;
        else return false;
      });

      const list = items.map(item => `${item[1]}`);
      const test = list.join(', ')
      return test;
    }
}
