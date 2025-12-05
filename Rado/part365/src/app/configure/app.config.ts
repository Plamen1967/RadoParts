import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core'
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router'

import { routes } from './app.routes'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { authInterceptor } from '@app/intercepter/loggingInreceptor'
import { provideAnimations } from '@angular/platform-browser/animations'

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(
            routes,
            withInMemoryScrolling({
                scrollPositionRestoration: 'top', // scrolls to top on route change
                anchorScrolling: 'disabled', // enables #anchor scrolling
            }),
            withComponentInputBinding()
        ),
        provideAnimations(),
        provideHttpClient(withInterceptors([authInterceptor])),
    ],
}
