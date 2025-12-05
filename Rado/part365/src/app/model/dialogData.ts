import { OptionItem } from "./optionitem";
import { SelectionItem } from "./selectionItem";

export interface DialogData {
    showAll: boolean;
    data: OptionItem[]|SelectionItem[];
    useLetter: boolean;
    groupSelection: boolean;
    value: string;
    multiSelection: boolean;
    groupDisabled: boolean;
    placeHolder: string;
    label: string;
    useFilter: boolean;
    showCount: boolean;

  }
  