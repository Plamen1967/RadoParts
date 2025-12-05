import { NgClass } from '@angular/common'
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Optional, Output, Renderer2, Self, ViewChild } from '@angular/core'
import { ControlValueAccessor, FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms'
import { RadioButton } from '@model/radioButton'
import { SelectOption } from '@model/selectOption'
import { SelectBaseComponent } from '../select-controls/select/select-base/select-base.component'

@Component({
    standalone: true,
    selector: 'app-radiogrouplist',
    templateUrl: './radiogrouplist.component.html',
    styleUrls: ['./radiogrouplist.component.scss'],
    imports: [NgClass, FormsModule, ReactiveFormsModule, SelectBaseComponent],
})
export class RadioGroupListComponent implements OnInit, ControlValueAccessor, AfterViewInit {
    id?: number
    _radios: RadioButton[] = []
    _value = 1;
    isDisabled = false
    controlName: string | undefined;
    selection: SelectOption[] = [];

    @Input() all = true;
    @Input() groupListDisplay: 'flex' | 'none' | undefined = 'flex';
    @Input() set radios(radioButtons: RadioButton[]) {
        this._radios = [...radioButtons]
        this.selection = this._radios?.map(radio => { 
            return { value: radio.id, text: radio.label, count: radio.count}
    });
    }
    @Input() itemSize = 70
    @Input() label?: string
    @Input() style = 1
    @Output() changeRadioGroup: EventEmitter<number> = new EventEmitter<number>()

    @ViewChild('radioGroup', { static: false }) radioGroup?: ElementRef
    constructor(
        @Optional() @Self() public ngControl: NgControl,
        private renderer: Renderer2,
        private _el: ElementRef
    ) {
        if (this.ngControl) this.ngControl.valueAccessor = this
    }
    private onTouched?() { return; }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private onChange?(_: unknown) { return; }

    ngAfterViewInit(): void {
        if (this.onChange) this.onChange(this._value)
        this.controlName = this.ngControl?.name?.toString() || ''
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

    click(value: number) {
        this._value = value
        if (this.onChange) this.onChange(value)
        this.changeRadioGroup.emit(value)
    }
    ngOnInit() {
        this.id = Date.now()
    }

    isChecked(id: number) {
        return id == this._value ? true : undefined
    }

    controlId(id: number) {
        return this.ngControl.name?.toString() + id.toString()
    }
}
