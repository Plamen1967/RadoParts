import { Component, DestroyRef, ElementRef, inject, model, input, effect, output, computed } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { CompanyComponent } from '../select-controls/company/company.component'
import { NgClass, NgStyle } from '@angular/common'
import { ButtonGroupComponent } from '../buttonGroup/buttongroup.component'
import { OptionItem } from '@model/optionitem'
import { AlertService } from '@services/alert.service'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormValueControl, ValidationError } from '@angular/forms/signals'

@Component({
    selector: 'app-customselect',
    templateUrl: './customSelect.component.html',
    styleUrls: ['./customSelect.component.css'],
    imports: [NgClass, NgStyle, ButtonGroupComponent, ReactiveFormsModule],
})
export class CustomSelectComponent implements FormValueControl<number | string> {
    value = model<number| string>(0)
    letterItem = undefined
    data_: OptionItem[] = []
    loaded = false
    errorMessage?: string
    IsInvalid = false

    showGroup = input<boolean>(false)
    data = input<OptionItem[]>([])
    tooltip = input<string | undefined>(undefined)
    label = input<string | undefined>(undefined)
    hint = input<string | undefined>(undefined)
    showLetter = input<boolean | undefined>(undefined)
    letter = input<boolean | undefined>(undefined)
    isRequired = input<boolean>(false)
    submitted = input<boolean>(false)
    showAll = input<boolean>(true)
    groupDisabled = input<boolean>(false)
    useFilter = input<boolean>(false)
    multiSelection = input<boolean>(false)
    placeHolder = input<string | undefined>(undefined)
    showCount = input<boolean>(true)
    select = input<number | undefined>(undefined)
    changeOption = output<number|string>()
    closeDialog = output<ElementRef>()
    errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
    public dialog: MatDialog = inject(MatDialog)
    private alertService: AlertService = inject(AlertService)
    private destroyRef: DestroyRef = inject(DestroyRef)
    $selection = computed(() => {
            return this.data()?.find((item) => item.id == this.value())?.description ?? this.placeHolder() ?? ''
    });

    clearBox = computed<boolean>(() => {
        if (this.value() && this.value() != 0) {
            return true
        } else {
            return false
        }
    })
    
    constructor() {
        effect(() => {
            this.data_ = this.data() ?? []
            if (this.data_ && this.data_.length) this.loaded = true
        })

        // effect(() => {
        //     console.log(`Comppany Data : ${JSON.stringify(this.data())}`)
        //     console.log(`Selection: ${this.$selection()} ${this.value()}`)
        // })
        // effect(() => {
        //     console.log(`Custom Select Errors is: ${this.errors()}`)
        // })
    
        // effect(() => {
        //     console.log(`Custom Select Value is: ${this.value()}`)
        // })
        
        // effect(() => {
        //     console.log(`Custom Select Submitted is: ${this.submitted()}`)
        // })
        effect(() => {
            if (this.showGroup() === false) {
                this.data_ = this.data()?.filter((item) => item['groupModelId'] != item.id)
            } else {
                this.data_ = this.data() ?? []
            }

            if (this.data_ && this.data_.length) this.loaded = true
            // // if (this.value() && this.data() && this.data().length) {
            // //     this.change(this.value()!)
            // }
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
        this.changeOption.emit(this.value())
    }

    clickSelect() {
        console.log(`Click Select Value groupDisabled is: ${this.groupDisabled()} ${this.showGroup()}`)
        const dialogRef = this.dialog.open(CompanyComponent, {
            height: '100%',
            width: '100%',
            panelClass: 'custom-container',
            data: {
                data: this.data_.filter((item) => item.id != 0),
                userFilter: this.useFilter() ?? false,
                showGroup: this.showGroup() ?? true,
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
                this.changeOption.emit(this.value())
            })
    }

    clear() {
        this.change(0)
    }
    //#endregion
}

