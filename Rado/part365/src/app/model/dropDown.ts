import { SelectOption } from "./selectOption";

export class Dropdown {
    id?: number;
    name? : string;
    imageName? : string;
    count?: number;
    children : SelectOption[] = [];
}
