import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientIdService {

constructor(private httpClient: HttpClient) { }

clientId_?: string;

get clientId() {
  return sessionStorage.getItem("clientId") ?? "";
}

set clientId(value: string) {
  this.clientId_ = value;
}

getClientId() {
  return this.httpClient.get<number>(`${environment.restAPI}/clientId`);
}

}
