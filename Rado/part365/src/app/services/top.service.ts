import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopService {

  activate:  Subject<unknown> = new Subject<unknown>()
  close:  Subject<unknown> = new Subject<unknown>()
  dataSubject:  BehaviorSubject <unknown> = new BehaviorSubject <unknown>(undefined)
  property?: {label: string, useFilter: boolean};
  data: unknown;
  parent: unknown;
  returnData:  Subject<unknown> = new Subject<unknown>()
  component = undefined;
}
