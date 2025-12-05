import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dropdown } from '@model/dropDown';

@Component({
  standalone: true,
  selector: 'app-categoriesfooter',
  templateUrl: './categoriesfooter.component.html',
  styleUrls: ['./categoriesfooter.component.scss'],
  imports: []
})
export class CategoriesFooterComponent {


  @Input() categories?: Dropdown[];
  @Input() hideFilter?: boolean;

  @Output() categoryClick = new EventEmitter<number>()

  categoryMessage(name?: string) {
    const message: string = name?.split('-').join(' ') ?? '';
    return `${message.toLowerCase()}`;
  }
  categorySelected(categoryId: number) {
    this.categoryClick.emit(categoryId)
  }

}
