import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { Router } from '@angular/router'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { DealerActionType } from '@model/dealerActionType'
import { DisplayPartView } from '@model/displayPartView'
import { ItemType } from '@model/enum/itemType.enum'
import { UpdateEnum } from '@model/enum/update.enum'
import { StaticSelectionService } from '@services/staticSelection.service'
import { InfoLine } from '@model/infoLine'
import { RowComponent } from '@components/custom-controls/partRow/row.component'
import { DataRowComponent } from '@components/custom-controls/dataRow/dataRow.component'

@Component({
    standalone: true,
    selector: 'app-dealerviewtyre',
    templateUrl: './dealerViewTyre.component.html',
    styleUrls: ['./dealerViewTyre.component.css'],
    imports: [RowComponent, DataRowComponent],
})
export class DealerViewTyreComponent extends HelperComponent implements OnInit{
    id?: number
    item_!: DisplayPartView
    isTyre?: boolean
    isRim?: boolean
    tyrelines: InfoLine[] = []
    rimlines: InfoLine[] = []
    lines: InfoLine[] = []
    companyName?: string;
    modelName?: string;

    @Input() set item(value: DisplayPartView) {
        this.id = value.id
        this.item_ = {...value}
        this.isTyre = this.item_.itemType == ItemType.Tyre || this.item_.itemType == ItemType.RimWithTyre
        this.isRim = this.item_.itemType == ItemType.Rim || this.item_.itemType == ItemType.RimWithTyre
    }
    @Input() highlighted?: boolean
    @Output() action: EventEmitter<DealerActionType> = new EventEmitter<DealerActionType>()

    constructor(
        private staticService: StaticSelectionService,
        private router: Router
    ) {
        super()
    }
    ngOnInit(): void {
        this.generateLine();
    }

    get typeDescription() {
        if (this.isTyre && this.isRim) return 'Джанта с гума'
        if (this.isTyre) return 'Гума'
        if (this.isRim) return 'Джанта'
        return undefined
    }

    get dot() {
        let dot_
        if (this.item_?.yearDOT) dot_ = `${this.item_?.monthDOT?.toString().padStart(2, '0')}/${this.item_.yearDOT.toString().padStart(2, '0')}`
        return dot_
    }
    updateTyre(id?: number) {
        const queryParams = { id: id, view: 'list' }
        this.router.navigate([`data/updateTyre`], { queryParams: queryParams })
    }

    deleteTyre(id?: number) {
        this.action.emit({ action: UpdateEnum.Delete, id: id, car: false })
    }

    generateLine() {
        this.lines.push({})
        if (this.isTyre) this.generateTyreLine()
        if (this.isRim) this.generateRimLine()

        if (this.item_.description) this.lines.push({ label: this.labels.DESCRIPTION, value: this.item_.description, price: false })

        this.lines.push({ label: this.labels.REGION, value: this.item_.regionName, price: false })
        this.lines.push({ label: this.labels.PRICE, value: this.item_.price, price: true })
    }

    generateTyreLine() {
        if (!this.item_) return

        if (this.item_.count) this.tyrelines.push({ label: 'Брой', value: this.item_.count, price: false })

        this.tyrelines.push({ label: 'Размер', value: `${this.item_.tyreWidthName}${this.item_.tyreHeightName}R${this.item_.tyreRadiusName}`, price: false })
        if (this.item_.tyreTypeName) this.tyrelines.push({ label: this.labels.TYRE_TYPE, value: this.item_.tyreTypeName, price: false })
        if (this.item_.tyreCompanyId) this.tyrelines.push({ label: this.labels.TYRE_PRODUCER, value: this.item_.tyreCompanyName, price: false })
        if (this.dot) this.tyrelines.push({ label: 'Д.О.Т', value: this.dot, price: false })
    }

    generateRimLine() {
        if (!this.item_) return
        if (this.item_.count) this.rimlines.push({ label: 'Брой', value: this.item_.count, price: false })
        if (this.item_.companyId) this.rimlines.push({ label: 'Марка', value: this.item_.companyName, price: false })
        if (this.item_.modelId) this.rimlines.push({ label: 'Модел', value: this.item_.modelName, price: false })
        if (this.item_.rimWidthName) this.rimlines.push({ label: this.labels.TYRE_WIDTH, value: this.item_.rimWidthName, price: false })
        if (this.item_.rimMaterialName) this.rimlines.push({ label: 'Материал', value: this.item_.rimMaterialName, price: false })
        if (this.item_.rimOffsetName) this.rimlines.push({ label: 'Офсет', value: this.item_.rimOffsetName, price: false })
        if (this.item_.rimBoltCountName) this.rimlines.push({ label: 'Брой болтове', value: this.item_.rimBoltCountName, price: false })
        if (this.item_.rimBoltDistanceName) this.rimlines.push({ label: 'Болт разстояние', value: this.item_.rimBoltDistanceName, price: false })
        if (this.item_.rimCenterName) this.rimlines.push({ label: 'Център', value: this.item_.rimCenterName, price: false })
            if (this.item_.regionId)
                this.lines.push({ label: 'Регион', value: this.staticService.Region.find((x) => x.value === this.item_?.regionId)!.text!, price: false })
          
        this.companyName = this.item_.companyName ?? '';
        this.modelName = this.item_.modelName ?? ''
    }
}
