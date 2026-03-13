import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '@env/environment'
import { LoggerService } from '@services/authentication/logger.service'
import { Message } from '../model/Message'

@Injectable({
    providedIn: 'root',
})
export class MessageService {
    httpHeader = {
        headers: new HttpHeaders({
            'content-type': 'application/json',
            accept: '*/*',
        }),
    }

    constructor(
        private httpClient: HttpClient,
        private loggerService: LoggerService
    ) {}

    fetchMessages() {
        // Implementation for fetching messages
        return this.httpClient.get<Message[]>('/api/message/fetchMessages', this.httpHeader)
    }

    sendEmail(value: string) {
        return this.httpClient.post<boolean>(`${environment.restAPI}/message/sendEmailMessage`, value, this.httpHeader)
    }

    addMessage(message: Message) {
        message.msgDate = Date.now()
        return this.httpClient.post<boolean>(`${environment.restAPI}/message/addMessage`, message, this.httpHeader)
    }

    getMessagesPerUser(userId: number) {
        return this.httpClient.get<Message[]>(`${environment.restAPI}/message/getUserMessages?userId=${userId}`, this.httpHeader)
    }
    getMessages() {
        return this.httpClient.get<Message[]>(`${environment.restAPI}/message/GetUserMessages`, this.httpHeader)
    }
}
