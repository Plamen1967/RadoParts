import { Component, OnInit } from '@angular/core';
import { Message } from '../model/Message';
import { MessageService } from '../service/messageService';

@Component({
  standalone: true,
  selector: 'app-list-message',
  templateUrl: './list-message.component.html',
  styleUrls: ['./list-message.component.css']
})
export default class ListMessageComponent implements OnInit {

  messages: Message[] = [];
  constructor(private messageService: MessageService) { }

  ngOnInit() {
    this.messageService.getMessages().subscribe((messages) => {
      this.messages = messages.map(msg => {
        msg.messageDateString = new Date(msg.msgDate).toLocaleDateString();
        return msg;
      })
    });
  }

}
