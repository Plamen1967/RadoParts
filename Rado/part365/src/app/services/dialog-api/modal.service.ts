import { Injectable } from '@angular/core';
import { ConfirmationComponent } from '@components/dialogs/confirmation/confirmation.component';
import { ModalComponent } from '@components/dialogs/jw-modal/jw-modal.component';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

content? : string;  
dialogMap: Map<string, NgbModal> = new Map<string, NgbModal>();
closeResult? : string;
private modals: (ModalComponent | ConfirmationComponent)[] = []

constructor(private ngbModal: NgbModal) { }

initDialog(dialogName: string, dialog : NgbModal) {
  this.dialogMap.set(dialogName.toLowerCase(), dialog);
}

removeDialog(dialogName: string) {
  this.dialogMap.delete(dialogName)
}
public showDialog(dialogName: string) {
  const dialog = this.dialogMap.get(dialogName.toLowerCase())
  return dialog;
  }

  
public openDialog(content: string) {
  const ngbModuleRef = this.ngbModal.open(content, {ariaLabelledBy: 'modal-basic-title', centered : true, backdropClass: 'light-blue-backdrop'})
  ngbModuleRef.result.then((result) => 
    {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    return ngbModuleRef;
}  

  private getDismissReason(reason: ModalDismissReasons): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  
  add(modal: ModalComponent | ConfirmationComponent) {
    this.modals.push(modal);
  }
}
