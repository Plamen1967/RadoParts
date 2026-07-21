import { ElementRef, inject, Self,  } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { ErrorService } from '@services/error.service';


export class BaseControl<T> implements ControlValueAccessor {
  
  
  get contolName() : string { return this.control.name?.toString() || ''; };      
  value? : T;
  inputValue? : T;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected onTouched?() {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  protected onChange?(_: T) {}
  touched = false;
  isDisabled = false;
  protected outerHTML : string;
  autocomplete = 'none'

  @Self() public control: NgControl = inject(NgControl, { self: true });
  public errorService : ErrorService = inject(ErrorService);
  element : ElementRef = inject(ElementRef);

  constructor() { 
    if (this.control) 
      this.control.valueAccessor = this;
    this.outerHTML = this.element.nativeElement.outerHTML;
    const outername: string = this.element.nativeElement.outerHTML;
    const arr = outername.split(' ');
    this.autocomplete = arr.find(item => item.includes('formcontrolname'))?.split('=')[1] ?? 'none';
    this.autocomplete = this.autocomplete.replaceAll('"', '');

  }


  writeValue(obj: T): void {
    this.value = obj;
    this.inputValue = obj;
  }

  registerOnChange(fn: (_: unknown) => unknown): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => unknown): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
 
  get errorMessage() {
    return this.errorService.getMessage(this.contolName, this.control.errors);
  }

  get errors() {
    return this.control.errors;
  }
}
