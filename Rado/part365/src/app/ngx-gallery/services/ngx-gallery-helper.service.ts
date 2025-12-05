import { Injectable, ElementRef, Renderer2 } from '@angular/core';

@Injectable()
export class NgxGalleryHelperService {

    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    private swipeHandlers: Map<string, Function[]> = new Map<string, Function[]>();

    constructor(private renderer: Renderer2) {}

    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    manageSwipe(status: boolean, element: ElementRef, id: string, nextHandler: Function, prevHandler: Function): void {

        const handlers = this.getSwipeHandlers(id);

        // swipeleft and swiperight are available only if hammerjs is included
        try {
            if (status && !handlers) {
                this.swipeHandlers.set(id, [
                    this.renderer.listen(element.nativeElement, 'swipeleft', () => nextHandler()),
                    this.renderer.listen(element.nativeElement, 'swiperight', () => prevHandler())
                ]);
            } else if (!status && handlers) {
                handlers.map((handler) => handler());
                this.removeSwipeHandlers(id);
            }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) { /* empty */ }
    }

    validateUrl(url: string): string {
        if (url.replace) {
            return url.replace(new RegExp(' ', 'g'), '%20')
                .replace(new RegExp('\'', 'g'), '%27');
        } else {
            return url;
        }
    }

    getBackgroundUrl(image: string) {
        return 'url(\'' + this.validateUrl(image) + '\')';
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    private getSwipeHandlers(id: string): Function[] | undefined {
        return this.swipeHandlers.get(id);
    }

    private removeSwipeHandlers(id: string): void {
        this.swipeHandlers.delete(id);
    }
}
