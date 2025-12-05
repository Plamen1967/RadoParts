import { of } from 'rxjs'
import { HttpParams } from '@angular/common/http'

export function handleError<T>(operation: string, returnValue?: T) {
    return () => {
        // inject(LoggerService).log(`Error in ${operation}`);

        return of(returnValue as T)
    }
}

export function convertToParam<T>(data: T): HttpParams {
    let params = new HttpParams()
    let property: keyof T
    for (property in data) {
        const value = data[property]
        if (value != null && value !== '') params = params.set(property, `${value}`)
    }
    return params
}
