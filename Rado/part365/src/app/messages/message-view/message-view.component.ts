import { Component, inject, Input} from '@angular/core';
import { Message } from '../model/Message';
import { MessageService } from '../service/messageService';
import { PopUpService } from '@app/dialog/services/popUpService.service';
import { LoggerService } from '@services/authentication/logger.service';

@Component({
  selector: 'app-message-view',
  templateUrl: './message-view.component.html',
  styleUrls: ['./message-view.component.css']
})
export class MessageViewComponent{
  @Input({required: true}) message: Message | undefined;
  messageService = inject(MessageService);
  private popupService: PopUpService = inject(PopUpService);
  private loggerService: LoggerService = inject(LoggerService);

markRead(isRead: boolean) {
  this.messageService.markAsRead(this.message!.id, isRead).subscribe({
    next: () => {
      this.message!.isRead = isRead ? 1 : 0;
      this.popupService.openWithTimeout('Съобщение', `Съобщението е маркирано като прочетено.`, 2000);
    },
    error: (error) => {
      this.loggerService.logError(`Error marking message as read: ${error}`);
      this.popupService.openWithTimeout('Съобщение', `Съобщението не може да бъде актуализирано.`, 2000);
    }
  })
}
delete_message() {

    this.messageService.deleteMessage(this.message!.id).subscribe(
      {
       next: () => {
          this.popupService.openWithTimeout('Съобщение', `Съобщението е изтрито успешно.`, 2000);
      },
        error: (error) => {
          this.loggerService.logError(`Error deleting message: ${error}`);
          this.popupService.openWithTimeout('Съобщение', `Съобщението не може да бъде изтрито.`, 2000);
        }
      }
    );
  } 

}
