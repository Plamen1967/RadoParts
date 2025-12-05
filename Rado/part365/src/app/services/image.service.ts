import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { environment } from '@env/environment'
import { Observable, of } from 'rxjs'
import { catchError, first, map, tap } from 'rxjs/operators'
import { LoggerService } from './authentication/logger.service'
import { ImageData } from '@model/imageData'
import { CatchaItem } from '@model/catchaItem'
import { Catcha } from '@model/catcha'

@Injectable({
    providedIn: 'root',
})
export class ImageService {
    httpHeader = {
        headers: new HttpHeaders({
            'content-type': 'application/json',
            accept: '*/*',
        }),
    }

    businessCardImages: ImageData[] = []
    constructor(
        private http: HttpClient,
        private loggerService: LoggerService
    ) {}

    getImages(id: number): Observable<ImageData[]> {
        const params = new HttpParams().set('id', `${id}`)
        return this.http.get<ImageData[]>(`${environment.restAPI}/image/GetImages`, { params }).pipe(
            first(),
            tap(() => this.loggerService.log(`Search for GetImages ${id}`)),
            catchError(this.handleError('fetch GetImages', []))
        )
    }

    uploadWebImage(itemId: number, imageId: number, image: string): Observable<ImageData> {
        return this.http.post<ImageData>(`${environment.restAPI}/image/UploadWebImage`, { itemId: itemId, imageId: imageId, image: image })
    }

    verifyCatcha(param: CatchaItem): Observable<boolean> {
        return this.http.post<boolean>(`${environment.restAPI}/image/verifyCatcha`, param)
    }

    deleteBusinessCardImage(): Observable<string> {
        return this.http.post(`${environment.restAPI}/image/deleteBusinessCardImage`, {}, { responseType: 'text' }).pipe(first())
    }

    getImageCount(id: number): Observable<number> {
        return this.http.get<number>(`${environment.restAPI}/image/GetImageCount?id=${id}`).pipe(
            first(),
            tap(() => this.loggerService.log(`GetImage Count ${id}`)),
            catchError(this.handleError('fetch GetImage Count', -1))
        )
    }
    getMinImages(id: number): Observable<ImageData[]> {
        const params = new HttpParams().set('id', `${id}`)
        return this.http.get<ImageData[]>(`${environment.restAPI}/image/GetMinImages`, { params }).pipe(
            first(),
            tap(() => this.loggerService.log(`Search for GetMinImages ${id}`)),
            catchError(this.handleError('fetch GetMinImages', []))
        )
    }

    getBusinessCardImage(id: number): Observable<ImageData | undefined> {
        const businessCardImage = this.businessCardImages.find((image) => image.objectId == id)
        if (businessCardImage) return of(businessCardImage)

        const params = new HttpParams().set('id', `${id}`)
        return this.http.get<ImageData>(`${environment.restAPI}/image/getBusinessCardImage`, { params }).pipe(
            first(),
            map((res) => {
                this.businessCardImages.push(res)
                return res
            }),
            tap(() => this.loggerService.log(`Search for getBusinessCard ${id}`)),
            catchError(this.handleError('fetch GetImages', undefined))
        )
    }

    getMainImages(ids: number[]): Observable<ImageData[]> {
        const idString = ids.join(',')
        const params = new HttpParams().set('ids', `${idString}`)
        return this.http.get<ImageData[]>(`${environment.restAPI}/image/GetMainImages`, { params }).pipe(
            first(),
            tap(() => this.loggerService.log(`Search for GetMainPicture ${idString}`)),
            catchError(this.handleError('fetch GetMainPicture', []))
        )
    }

    getMainPicture(id: number): Observable<ImageData | undefined> {
        const params = new HttpParams().set('id', `${id}`)
        return this.http.get<ImageData>(`${environment.restAPI}/image/GetMainImage`, { params }).pipe(
            first(),
            tap(() => this.loggerService.log(`Search for GetMainPicture ${id}`)),
            catchError(this.handleError('fetch GetMainPicture', undefined))
        )
    }
    // setMainPicture(id: number, mainPictureId: number, mainPicture: string): Observable<ImageData | undefined> {
    //     const params = new HttpParams().set('id', `${id}`)
    //     return this.http.get<ImageData>(`${environment.restAPI}/image/SetMainImage`, { params }).pipe(
    //         first(),
    //         tap(() => this.loggerService.log(`Search for GetMainPicture ${id}`)),
    //         catchError(this.handleError('fetch GetMainPicture', undefined))
    //     )
    // }

    deleteImage(imageId: number): Observable<boolean> {
        return this.http.delete<boolean>(`${environment.restAPI}/image/${imageId}`).pipe(first())
    }

    getCatcha(): Observable<Catcha> {
        return this.http.get<Catcha>(`${environment.restAPI}/image/GetCatcha`)
    }
    uploadImages(files: File[], partId: number, businessCard: boolean) {
        if (businessCard) {
            return this.uploadBusinessCard(files[0], partId)
        }

        const filesToUpload: File[] = files
        const formData = new FormData()

        Array.from(filesToUpload).map((file, index) => {
            return formData.append('file' + index, file, file.name)
        })

        formData.append('partId', partId.toString())
        return this.http.post<ImageData[]>(`${environment.restAPI}/image/upload`, formData, { reportProgress: true, observe: 'events' })
    }

    uploadBusinessCard(file: File, userId: number) {
        const filesToUpload: File = file

        let fileName = filesToUpload.name
        const lastSlash = fileName.lastIndexOf('\\')
        const lastDot = fileName.lastIndexOf('.')
        fileName = fileName.substring(0, lastSlash + 1) + 'businessCard' + fileName.substring(lastDot)

        const formData = new FormData()
        formData.append('file' + 0, file, fileName)

        formData.append('partId', userId.toString())
        return this.http.post<ImageData[]>(`${environment.restAPI}/image/upload`, formData, { reportProgress: true, observe: 'events' })
    }

    handleError<T>(operation: string, returnValue?: T) {
        return () => {
            this.loggerService.logError(`operation ${operation} failed`)
            return of(returnValue as T)
        }
    }
}
