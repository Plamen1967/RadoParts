import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Message } from '@model/message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

constructor(private httpClient : HttpClient) { 

}

httpHeader = {
  headers: new HttpHeaders({
    'content-type': 'application/json',
    'accept': '*/*'
  })
}

sendEmail(value: string) {
  return this.httpClient.post<boolean>(`${environment.restAPI}/message/sendEmailMessage`, value, this.httpHeader);
}

addMessage(message: Message) {
  message.msgDate = Date.now();
  return this.httpClient.post<boolean>(`${environment.restAPI}/message/addMessage`, message, this.httpHeader);
}

getMessages(userId: number) {
  return this.httpClient.get<Message[]>(`${environment.restAPI}/message/getUserMessages?userId=${userId}`, this.httpHeader);
}

}
