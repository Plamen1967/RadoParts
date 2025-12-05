import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { LoggerService } from '@services/authentication/logger.service';
import { StaticSelectionService } from '@services/staticSelection.service';
import { UpdateEnum } from '@model/enum/update.enum';
import { DisplayPartView, Enrich } from '@model/displayPartView';
import { RimWithTyre } from '@model/tyre/rimWithTyre';
import { CountTyres } from '@model/countTyres';

@Injectable({
  providedIn: 'root'
})
export class TyreService {

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'accept': '*/*'
    })
  }

constructor(private http: HttpClient,
  private loggerService: LoggerService,
  private staticService: StaticSelectionService) { }

addUpdateItem(tyre: RimWithTyre, update: UpdateEnum) {
  if (tyre.price) tyre.price = +tyre.price;
  if (!tyre.monthDOT) tyre.monthDOT = 0; 
  if (!tyre.yearDOT) tyre.yearDOT = 0; 
  if (!tyre.mainPicture) tyre.mainPicture = "";
  tyre.modifiedTime = Date.now();
  tyre.mainImageId = +tyre.mainImageId!;
  if (update === UpdateEnum.Update) {
    return this.updateItem(tyre);
  }
  else {
    return this.addItem(tyre);
  }
}

addItem(item: RimWithTyre): Observable<DisplayPartView> {
  return this.http.post<DisplayPartView>(`${environment.restAPI}/rimWithTyre/${item.rimWithTyreId}`, item, this.httpHeader).pipe(map(item => Enrich(item, this.staticService)));
}
updateItem(item: RimWithTyre): Observable<DisplayPartView> {
  return this.http.patch<DisplayPartView>(`${environment.restAPI}/rimWithTyre/${item.rimWithTyreId}`, item, this.httpHeader).pipe(map(item => Enrich(item, this.staticService)));
}

deleteItem(tyreId: number): Observable<boolean> {
  return this.http.post<boolean>(`${environment.restAPI}/rimWithTyre/delete/`, {id: tyreId}, this.httpHeader)
    .pipe(tap(() => this.loggerService.log(`delete tyre ${tyreId}`)),
      catchError(this.handleError("fetch tyre", false)))

}

getItem(tyreId: number): Observable<RimWithTyre> {
  return this.http.get<RimWithTyre>(`${environment.restAPI}/rimWithTyre/${tyreId}`);
}

getCount(): Observable<CountTyres> {
  return this.http.get<CountTyres>(`${environment.restAPI}/rimWithTyre/getCount`);
}

handleError<T>(operation: string, returnValue?: T) {
  return () => {
    this.loggerService.logError(`operation ${operation} failed`);
    return of(returnValue as T);
  }

}

}
