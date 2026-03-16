import { Injectable } from '@angular/core';
import { signal } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class MenuService {
public showMenu = signal(false);
constructor() { }



}
