import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  currentId?: number;
  currentPartId? : number;
  
  
  reset() {
    this.currentId = undefined
    this.currentPartId = undefined
  }}

