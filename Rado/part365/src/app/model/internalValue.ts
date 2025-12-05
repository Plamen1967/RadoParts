import { OptionItem } from "./optionitem"
import { TypeItem } from "./enum/typeItem";

export class InternalValue extends OptionItem {
    isSelected = false
    isElementDisabled = false
    isSelectable = false
    isLetter = false
    showItem = false
    group = false
    checked = false;
    letters: string[] = []
    imageName?: string;
    typeItem = TypeItem.ALL
}

