import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Optional, output, Output, Renderer2, Self, ViewChild } from '@angular/core'
import { ControlValueAccessor, FormsModule, NgControl } from '@angular/forms'
import { RadioButton } from '@model/radioButton'

@Component({
    standalone: true,
    selector: 'app-radiogroup',
    templateUrl: './radiogroup.component.html',
    styleUrls: ['./radiogroup.component.css'],
    imports: [FormsModule],
})
export class RadioGroupComponent implements ControlValueAccessor, AfterViewInit {
    _radios: RadioButton[] = []
    _value = 1
    panelClosed = output<number>();
    // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
    private onChange?(_: unknown) {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private onTouched?() {}
    isDisabled = false
    controlName?: string | number

    @Input() set radios(value: RadioButton[]) {
        this._radios = value
    }
    @Input() set value(value: number) {
      this.writeValue(value)
    }
    @Input() itemSize = 70
    @Output() changeRadioGroup: EventEmitter<number> = new EventEmitter<number>()

    @ViewChild('radioGroup', { static: false }) radioGroup?: ElementRef
    constructor(
        @Optional() @Self() public ngControl: NgControl,
        private renderer: Renderer2,
        private _el: ElementRef
    ) {
        if (this.ngControl) this.ngControl.valueAccessor = this
    }
    ngAfterViewInit(): void {
        if (this.onChange) this.onChange(this._value)
        this.controlName = this.ngControl?.name || ''
    }

    writeValue(value: number): void {
        this._value = value
    }
    registerOnChange(fn: (_: unknown) => unknown): void {
        this.onChange = fn
    }
    registerOnTouched(fn: () => unknown): void {
        this.onTouched = fn
    }
    setDisabledState?(isDisabled: boolean): void {
        this.isDisabled = isDisabled
    }

    click(event: Event, value: number) {
        event.stopPropagation();
        this._value = value
        if (this.onChange) this.onChange(value)
        this.panelClosed.emit(value);
    }

    isChecked(id: number) {
        return id == this._value ? true : undefined
    }
}
