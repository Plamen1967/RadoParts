import { Component, DestroyRef, ElementRef, inject, model, input, effect, output } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { CompanyComponent } from '../select-controls/company/company.component'
import { NgClass, NgStyle } from '@angular/common'
import { ButtonGroupComponent } from '../buttonGroup/buttongroup.component'
import { OptionItem } from '@model/optionitem'
import { AlertService } from '@services/alert.service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormValueControl } from '@angular/forms/signals'

@Component({
    selector: 'app-customselect',
    templateUrl: './customSelect.component.html',
    styleUrls: ['./customSelect.component.css'],
    imports: [NgClass, NgStyle, ButtonGroupComponent, ReactiveFormsModule],
})
export class CustomSelectComponent implements FormValueControl<number | string> {
    value = model<number| string>(0)
    selectedValue?: number
    letterItem = undefined
    data_: OptionItem[] = []
    clearBox?: boolean
    loaded = false
    errorMessage?: string
    IsInvalid = false

    groupSelection = input<boolean>(false)
    data = input<OptionItem[]>([])
    tooltip = input<string | undefined>(undefined)
    label = input<string | undefined>(undefined)
    hint = input<string | undefined>(undefined)
    showLetter = input<boolean | undefined>(undefined)
    letter = input<boolean | undefined>(undefined)
    IsRequired = input<boolean | undefined>(undefined)
    submitted = input<boolean | undefined>(undefined)
    showAll = input<boolean>(true)
    groupDisabled = input<boolean>(false)
    useFilter = input<boolean>(false)
    multiSelection = input<boolean>(false)
    placeHolder = input<string | undefined>(undefined)
    showCount = input<boolean>(true)
    isRequired = input<boolean>(false)
    select = input<number | undefined>(undefined)

    changeOption = output<number>()
    closeDialog = output<ElementRef>()

    public dialog: MatDialog = inject(MatDialog)
    private alertService: AlertService = inject(AlertService)
    private destroyRef: DestroyRef = inject(DestroyRef)
    // _selection = computed<string | undefined>(() => {
    //     console.log(`Value is: ${this.value()}`)
    //     return 
    // })

    _selection = '';

    constructor() {
        effect(() => {
            this.data_ = this.data() ?? []
            if (this.data_ && this.data_.length) this.loaded = true
            // if (this.value() && this.data() && this.data().length) {
            //     this.change(this.value())
            // }

            this._selection = this.data()?.find((item) => item.id == this.value())?.description ?? this.placeHolder() ?? ''
        })
    
        effect(() => {
            if (this.groupDisabled()) {
                this.data_ = this.data()?.filter((item) => item['groupModelId'] != item.id)
            } else {
                this.data_ = this.data() ?? []
            }

            if (this.data_ && this.data_.length) this.loaded = true
            // // if (this.value() && this.data() && this.data().length) {
            // //     this.change(this.value()!)
            // }
        })

        effect(() => {
            console.log(`Custome Select Value Changed`, this.value())
        })
   }

    //#region ValueAccessor
    change(value?: number) {
        if (Array.isArray(value)) {
            this.value.set(value[0])
        } else {
            this.value.set(value?.toString() ?? '')
        }
        console.log(`Change Value is: ${this.value()}`)
        this.clearBox = this.value() ? true : false
    }

    clickSelect() {
        const dialogRef = this.dialog.open(CompanyComponent, {
            height: '100%',
            width: '100%',
            panelClass: 'custom-container',
            data: {
                data: this.data_,
                userFilter: this.useFilter() ?? false,
                groupSelection: this.groupSelection() ?? true,
                value: this.value(),
                multiSelection: this.multiSelection(),
                groupDisabled: this.groupDisabled(),
                placeHolder: this.placeHolder(),
                showCount: this.showCount(),
                useFilter: true,
                label: '',
            },
        })
        dialogRef
            .afterClosed()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((result) => {
                if (result) 
                    if (this.multiSelection())
                    this.value.set(result)
                        else
                    this.value.set(+result)
                this.alertService.info(`Dialog result: ${result}`)
            })
    }

    clear() {
        this.change(0)
    }
    //#endregion
}

