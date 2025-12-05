export enum OKCancelOption {
    OK,
    Cancel
}
export class ConfirmDialogData {
    title?: string
    content?: string;
    okButtonName?: string;
    cancelButtonName?: string;
    okCancel: OKCancelOption = OKCancelOption.Cancel;
}

