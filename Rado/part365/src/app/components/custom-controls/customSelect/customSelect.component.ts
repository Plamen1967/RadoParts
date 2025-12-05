import { AfterViewInit, Component, DestroyRef, ElementRef, EventEmitter, Input, OnInit, Output, Self } from '@angular/core'
import { ControlValueAccessor, NgControl } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { CompanyComponent } from './x-company/company.component'
import { ErrorService } from '@services/error.service'
import { NgClass, NgIf, NgStyle } from '@angular/common'
import { ButtonGroupComponent } from '../buttonGroup/buttongroup.component'
import { OptionItem } from '@model/optionitem'
import { BaseControl } from '../baseControl'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'

@Component({
    standalone: true,
    selector: 'app-customselect',
    templateUrl: './customSelect.component.html',
    styleUrls: ['./customSelect.component.css'],
    imports: [NgClass, NgStyle, ButtonGroupComponent, NgIf]
})
export class CustomSelectComponent extends BaseControl<number> implements OnInit, ControlValueAccessor, AfterViewInit {

    selectedValue?: number
    letterItem = undefined
    _selection?: string
    data_: OptionItem[] = []
    clearBox?: boolean;

   
    @Output() changeOption: EventEmitter<number> = new EventEmitter<number>()
    @Output() closeDialog: EventEmitter<ElementRef> = new EventEmitter<ElementRef>()
    @Input() displayProperty = 'text'
    @Input() valueProperty = 'value'
    @Input() countProperty = 'count'
    @Input() groupSelection = false
    @Input() set data(data_:  OptionItem[]) {
        this.data_ = [...data_];

        if (this.groupDisabled) {
            this.data_ = this.data_?.filter((item) => item['groupModelId'] != item.id)
        }
        this._selection = this.data_?.find((item) => item.id === this.value)?.description ?? this.placeHolder
    }
    @Input() tooltip?: string
    @Input() label?: string
    @Input() hint?: string
    @Input() showLetter?: boolean
    @Input() letter?: boolean
    @Input() required?: boolean
    @Input() submitted?: boolean
    @Input() showAll = true
    @Input() groupDisabled = false
    @Input() useFilter = false
    @Input() multiSelection = false
    @Input() placeHolder?: string
    constructor(
        @Self() control: NgControl,
        public dialog: MatDialog,
        errorService: ErrorService,
        el: ElementRef,
                private destroyRef: DestroyRef
    ) {
        super(control, errorService, el)
    }

    ngOnInit() {
        this._selection = this.placeHolder
    }

    ngAfterViewInit(): void {
        console.log(this.label)
    }

    //#region ValueAccessor
    override writeValue(value: number): void {
        this.value = value
        this.clearBox = value ? true : false
        this._selection = this.data_?.find((item) => item.id === value)?.description ?? this.placeHolder
        this.changeOption.emit(value)
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    markAsTouched() {}

    change(value?: number) {
        this.clearBox = value ? true : false
        this._selection = this.data_?.find((item) => item.id === value)?.description ?? this.placeHolder
        if (this.onChange) this.onChange(value!);
    }

    clickSelect() {
        if (!this.data_) return;
        const dialogRef = this.dialog.open(CompanyComponent, {
            height: '100%',
            width: '100%',
            panelClass: 'custom-container',
            data: {
                data: this.data_,
                userFilter: this.useFilter ?? false,
                groupSelection: this.groupSelection ?? true,
                value: this.value,
                multiSelection: this.multiSelection,
                groupDisabled: this.groupDisabled,
                placeHolder: this.placeHolder,
            },
        })
        dialogRef.afterClosed()
                .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((result) => {
            if (result) this.change(result)
            console.log(`Dialog result: ${result}`)
        })
    }

    clear() {
        this._selection = this.placeHolder
        this.change(undefined)
    }
    override get contolName(): string {
        return this.control.name?.toString() ?? this.placeHolder ?? this.label ?? 'Избери';
    }

    updateData() {
        // TODO
        return;
    }
    //#endregion
}
