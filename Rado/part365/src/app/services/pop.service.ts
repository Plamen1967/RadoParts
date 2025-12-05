import { Injectable } from '@angular/core';
import { ModalService } from './dialog-api/modal.service';

@Injectable({
  providedIn: 'root'
})
export class PopService {

constructor(private modalService: ModalService) { }

private message_ = ""
private header_ = "";
private time = 2000;

public getMessage() {
  return this.message_
}
private get message() {
  return this.message_
}

private set message(value: string) {
  this.message_ = value;
}

public getHeader() {
  return this.header_
}

private get header() {
  return this.header_
}

private set header(value: string) {
  this.header_ = value;
}

private close() {
  console.log(`ClosePopup`)
  // TODO this.modalService.close("popup");
}

public closePopup() {
  console.log(`ClosePopup`)
  // TODO this.modalService.close("popup");
}

public openPopup(header: string, message: string) {
  console.log(`openPopup`)
  this.header_ = header;
  this.message_ = message;
  // TODO this.modalService.open("popup");
}
 

showMessage(header: string, message: string, time = 2000) {
  this.header_ = header;
  this.message_ = message;
  console.log(`Popup: ${time}`)
  // TODO this.modalService.open("popup");
  this.time = time;
  this.close.bind(this);
  setTimeout(() => {
    console.log(`PopService`)
    this.close()
  }, 2000)
}
}
