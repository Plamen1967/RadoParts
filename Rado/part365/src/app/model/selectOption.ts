export class SelectOption {
    value? : number;
    text? : string;
    count?: number = 0;
    color?: string;
    important?: boolean;
    displayText?: string;
    isDisabled? = () => {
        return this.value === -1;
    }
}

