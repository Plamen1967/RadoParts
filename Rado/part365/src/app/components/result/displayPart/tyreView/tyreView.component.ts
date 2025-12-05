import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { HelperComponent } from '@components/custom-controls/helper/helper.component'
import { DisplayPartView } from '@model/displayPartView'
import { ItemType } from '@model/enum/itemType.enum'
import { StaticSelectionService } from '@services/staticSelection.service'

@Component({
    standalone: true,
    selector: 'app-tyreview',
    templateUrl: './tyreView.component.html',
    styleUrls: ['./tyreView.component.css'],
    imports: [],
})
export class TyreViewComponent extends HelperComponent implements OnInit {
    @Input() set tyre(value: DisplayPartView) {
        this.item = value
        this.isTyre = this.item.itemType == ItemType.Tyre || this.item.itemType == ItemType.RimWithTyre
        this.isRim = this.item.itemType == ItemType.Rim || this.item.itemType == ItemType.RimWithTyre
        if (this.item.itemType == ItemType.Tyre) {
            this.typeDesc = 'Гума'
        } else if (this.item.itemType == ItemType.Rim) {
            this.typeDesc = 'Джанта'
        } else if (this.item.itemType == ItemType.RimWithTyre) {
            this.typeDesc = 'Гума с джанта'
        }
    }

    typeDesc?: string
    // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
    get tyre() {
        return this.item!
    }

    get itemType(): ItemType {
        return this.item?.itemType ?? ItemType.Tyre
    }
    @Output() unchecked: EventEmitter<number> = new EventEmitter<number>()

    item?: DisplayPartView
    isTyre?: boolean
    isRim?: boolean

    constructor(private staticService: StaticSelectionService) {
        super()
    }

    ngOnInit() {
        this.tyreDescription()
    }

    dotString?: string
    season?: string
    size?: string
    tyreCompanyName?: string
    tyreFields = "Размер,DOT,Вид,Производител";
    rimFields = "Щирочина,Материал,Център,Офсет,Брой болтове,Болт разстояние,Болт дистанция";
    tyreLine?: string
    rimLine?: string
    tyreDescription() {
        if (this.item?.tyreTagsMap) {
            const mapTags = this.item?.tyreTagsMap;
            const items = [...mapTags].filter(([k]) => {
                if (this.tyreFields.includes(k)) return true
                else return false
            })

            const list = items.map((item) => `${item[0]}:${item[1]}`)
            this.tyreLine = list.join(' , ')
        }
        if (this.item?.rimTagsMap) {
            const mapTags = this.item?.rimTagsMap;
            const items = [...mapTags].filter(([k]) => {
                if (this.rimFields.includes(k)) return true
                else return false
            })

            const list = items.map((item) => `${item[0]}:${item[1]}`)
            this.rimLine = list.join(' , ')
        }
    }

    get companyName() {
        return this.item?.companyName + (this.item?.modelName ?? '')
    }
    get count() {
        return `${this.item?.count}`
    }
}
