import { Component, ElementRef, EventEmitter, inject, input, model, output, Output, Renderer2, ViewChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { FormValueControl } from '@angular/forms/signals'
import { RadioButton } from '@model/radioButton'

@Component({
    selector: 'app-radiogroup',
    templateUrl: './radiogroup.component.html',
    styleUrls: ['./radiogroup.component.css'],
    imports: [FormsModule],
})
export class RadioGroupComponent implements FormValueControl<number|undefined> {
    value = model<number|undefined>(undefined)
    radios = input<RadioButton[]>([])
    @Output() changeRadioGroup: EventEmitter<number> = new EventEmitter<number>()
    panelClosed = output<number>()
    IsDisabled = input<boolean>(false)
    controlName = input<string | number>()

    @ViewChild('radioGroup', { static: false }) radioGroup?: ElementRef
    private renderer: Renderer2 = inject(Renderer2)
    private _el: ElementRef = inject(ElementRef)

    click(event: Event, value: number) {
        event.stopPropagation()
        this.value.set(value)
        this.panelClosed.emit(value)
    }

    isChecked(id: number) {
        return id == this.value() ? true : undefined
    }
}
