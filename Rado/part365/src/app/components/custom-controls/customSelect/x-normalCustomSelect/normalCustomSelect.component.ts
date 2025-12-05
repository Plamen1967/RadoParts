import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2, Self, ViewChild } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { ErrorService } from '@services/ErrorService/error.service';
import { SelectBase } from '../../selectBase';

@Component({
  selector: 'app-normalCustomSelect',
  templateUrl: './normalCustomSelect.component.html',
  styleUrls: ['./normalCustomSelect.component.css']
})

export class NormalCustomSelectComponent extends SelectBase implements OnInit, AfterViewInit {
  selectedValue: number;
  touched = false;
  isDisabled = false;
  key
  letterItem = undefined

  onChange: any = () => { }
  onTouch: any = () => { }

  @Output() changeOption: EventEmitter<any> = new EventEmitter<any>();
  @Output() onClose: EventEmitter<ElementRef> = new EventEmitter<ElementRef>();
  @Input() displayProperty: string = "text";
  @Input() valueProperty: string = "value";
  @Input() countProperty: string;
  @Input() groupSelection = false;
  @Input() set data(data_: []) { this.setData(data_) };
  @Input() placeHolder;
  @Input() hint;
  @Input() showLetter;
  @Input() letter: boolean | undefined;
  @Input() required: boolean;
  @Input() submitted;
  @Input() showAll = true;
  @Input() groupDisabled = false;
  @Input() useFilter = false;
  @Input() multiSelection = false;
  @Input() set setValue(value) {
    this.writeValue(value);
  };
  @Output() change: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild("filterElem") filterElem;
  @ViewChild("selected") selected;
  @ViewChild("selectBox") selectBox;
  @ViewChild("optionsContainer") optionsContainer;

  @HostListener('document:click', ['$event'])
  @HostListener('document:touchstart', ['$event'])
  handleOutsideClick(event) {
    // Some kind of logic to exclude clicks in Component.
    // This example is borrowed Kamil's answer
    if (!this.elem.nativeElement.contains(event.target))
      this.colapse()
  }

  constructor(private renderer: Renderer2,
    private elem: ElementRef,
    public errorService: ErrorService) {
    super();
  }



  ngOnInit() {
    this.setBase(this);
    this._selection = this.placeHolder;
  }

  ngAfterViewInit(): void {
    this.updataData();
  }

  //#region ValueAccessor
  writeValue(value: any): void {
    this._value = value;
    this.selection = '';
    let index = this._data?.findIndex(elem => elem[this.valueProperty] === this._value);
    if (index != -1 && this._data)
      this.selection = this._data[index][this.displayProperty];
    if (this.selection.trim().length == 0)
      this.selection = this.placeHolder
    this.selectedValue = value;
    this.changeOption.emit(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouch();
      this.touched = true;
    }
  }

  //#endregion

  blur() {
    this.markAsTouched();
  }

  //#region Events
  clear(event) {
    event.stopPropagation();
    this.writeValue(0)
    this.onChange(0);
    this.change.emit(0);
    this.markAsTouched();
    this.clickSelect(null);
    this.active = false;
    this.renderer.removeClass(this.optionsContainer.nativeElement, "active");
    this.onClose.emit();
  }

  colapse() {
    if (this.active) {
      this.renderer.removeClass(this.optionsContainer.nativeElement, "active");
      this.onClose.emit();
      this.active = false;
    }
  }

  onSelect(element) {
    this.value = element[this.valueProperty];;
    this.onChange(this.value);
    this.change.emit(this.selectedValue);
    this.markAsTouched();
    this.changeOption.emit(this.value);

  }

  click(item) {
    console.log('Click');

  }

  clickLetter(event, letter, item) {
    event.stopPropagation();
    event.preventDefault();
    if (this.letterItem == letter)
      this.letterItem = undefined
    else
      this.letterItem = letter;

    this.updataData();
  }

  clickItem(event, item) {
    console.log(item);
    event.preventDefault();
    if (this.isLetter(item)) {
      if (this.letterItem == item)
        this.letterItem = undefined
      else
        this.letterItem = item;
      return;
    }
    item.isSelected = true
    if (this.isElementDisabled(item)) return;

    this.selection = this.display(item);
    if (!this.multiSelection)
      this.clickSelect(null)
    this.value = item[this.valueProperty];
  }

  clickChechBox($event, item) {
    console.log(`Click checkbox ${item.display}`);
    this.clickItem($event, item)
  }


  clickSelect($event) {
    this.filter = '';
    if (this.useFilter) {
      // let element = document.getElementById(`${filter}Input`);
      // element.focus()
    }
    if ($event)
      $event.preventDefault();
    if (this.active == false) {
      this._notSelected = undefined
      this.renderer.addClass(this.optionsContainer.nativeElement, "active");
    }
    else {
      this.renderer.removeClass(this.optionsContainer.nativeElement, "active");
      this.onClose.emit();
    }

    this.active = !this.active;
    this.updataData();
  }

  filterChange(value) {
    this.filter = value;
    console.log(this.filter);
    this.updataData();
  }

  onChangeSelect(event) {
    this.value = this.selectedValue;
    this._value = this.selectedValue;
    this.markAsTouched();
    this.changeOption.emit(this.value);
    this.onClose.emit(this.elem);
  }

  //#endregion

  get clearBox() {
    return !!this._value;
  }

  set value(val: number) {
    this._value = val
    this.onChange(val)
    this.change.emit(val);
    this.onTouch(val)
  }

  get value() {
    return this.selectedValue;
  }

  getValue(element) {
    return element[this.valueProperty];
  }

  displayItem(item) {
    console.table(item)
  }
}
