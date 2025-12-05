import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { StaticSelectionService } from './staticSelection.service';
import { LocalStorageService } from './storage/localStorage.service';
import { PartView } from '@model/part/partView';
import { DisplayPartView, Enrich } from '@model/displayPartView';
import { CheckoutItem } from '@model/checkoutItem';

@Injectable({
  providedIn: 'root'
})
export class CheckOutService {

  public checkoutObj: BehaviorSubject<number>;
  public checkout: Observable<number>;
  public currentId?: number

httpHeader = {
  headers: new HttpHeaders({
    'content-type': 'application/json',
    'accept': '*/*',
    'Access-Control-Allow-Origin': 'true'
  })
}  

constructor(private http: HttpClient,
  private staticSelectionService: StaticSelectionService,
  private localStorageService: LocalStorageService) { 
  this.checkoutObj = new BehaviorSubject<number>(0);
  this.checkout = this.checkoutObj.asObservable();
}


addPart(part : PartView ) {
  return this.http.post<number>(`${environment.restAPI}/checkout`, part, this.httpHeader).pipe(first());
}

getItems() {
  return this.http.get<number>(`${environment.restAPI}/checkout/1`).pipe(first()).subscribe(x => this.updateItems(x))
}

getCheckoutItems() {
  const ids = this.localStorageService.checkOutItems.map((id: number) => `id=${id}`)
  return this.http.get<DisplayPartView[]>(`${environment.restAPI}/checkout/GetCheckOutItems?${ids.join('&')}`, this.httpHeader).pipe(map(res => {
    res.forEach((part) => {
      Enrich(part, this.staticSelectionService);
    })
    return res;
  }))
}

removeFromCheckout(checkoutId : number) {
  return this.http.delete<number>(`${environment.restAPI}/checkout/${checkoutId}`, this.httpHeader).pipe(first());
}

fetch() {
  return this.http.get<CheckoutItem[]>(`${environment.restAPI}/checkout`).pipe(first());
}

fetchItems() {
  return this.http.get<CheckoutItem[]>(`${environment.restAPI}/checkout/items`).pipe(first());
}

updateItems(items: number) {
  this.checkoutObj.next(items);
}

}
