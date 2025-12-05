import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Modification } from '@model/static-data/modification';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ModificationService {

constructor(private httpClient : HttpClient) { 

}

fetch(modelId: number) : Observable<Modification[]> {
  return this.httpClient.get<Modification[]>(`${environment.restAPI}/modification/${modelId}`).pipe(first());
}

fetchModifications(modelsId: string) : Observable<Modification[]> {
  let params = new HttpParams();

  params = params.set("modelsId", `${modelsId}`);
  return this.httpClient.get<Modification[]>(`${environment.restAPI}/modification/getModifications`, {params}).pipe(first());
}
fetchModificationsByUserId(modelsId: string) : Observable<Modification[]> {
  let params = new HttpParams();

  params = params.set("modelsId", `${modelsId}`);
  return this.httpClient.get<Modification[]>(`${environment.restAPI}/modification/getModificationsByUserId`, {params}).pipe(first());
}

fetchModificationsFull(modelsId: number) : Observable<Modification[]> {
  let params = new HttpParams();

  params = params.set("modelsId", `${modelsId}`);
  return this.httpClient.get<Modification[]>(`${environment.restAPI}/modification/getModificationsFull`, {params}).pipe(first());
}



fetchAll(): Observable<Modification[]> {
  return this.httpClient.get<Modification[]>(`${environment.restAPI}/modification`);
}
}
