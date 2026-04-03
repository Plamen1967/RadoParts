//#region imports
import { Component, inject, OnInit } from '@angular/core';
import { Message } from '../model/Message';
import { MessageService } from '../service/messageService';
//#endregion
//#region component
@Component({
  standalone: true,
  selector: 'app-list-message',
  templateUrl: './list-message.component.html',
  styleUrls: ['./list-message.component.css']
})
//#endregion

export default class ListMessageComponent implements OnInit {
  //#region variables and services
  messages: Message[] = [];
  private messageService: MessageService = inject(MessageService)
  //#endregion
  
  ngOnInit() {
    this.messageService.getMessages().subscribe((messages) => {
      this.messages = messages.map(msg => {
        msg.messageDateString = new Date(msg.msgDate).toLocaleDateString();
        return msg;
      })
    });
  }

}
