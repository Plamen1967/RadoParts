import { inject } from '@angular/core'
import { CONSTANT } from '@app/constant/globalLabels'
import { AuthenticationService } from '@services/authentication/authentication.service'

export class HelperComponent {
    public authenticationService: AuthenticationService

    constructor() {
        this.authenticationService = inject(AuthenticationService)
    }
    get labels() {
        return CONSTANT
    }

    get seller() {
        return this.authenticationService.seller
    }
    get logged() {
        return this.authenticationService.currentUserValue
    }

    get loggedUser() {
        return this.authenticationService.user
    }
    get regionId() {
        return this.loggedUser?.regionId;
    }

    // setNewId() {
    //     this.nextIdService.getNextId().then((nextId) => (this.partId = nextId))
    // }

}

export function Mandotary() {
    return function (target: object, key: string) {
        Object.defineProperty(target, key, {
            get: function () {
                throw new Error(`Attribute ${key} is required`)
            },
            set: function (value) {
                Object.defineProperty(target, key, {
                    value,
                    writable: true,
                    configurable: true,
                })
            },
            enumerable: true,
            configurable: true,
        })
    }
}

export function Required(target: object, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
        get() {
            throw new Error(`Attribute ${propertyKey} is required`)
        },
        set(value) {
            Object.defineProperty(target, propertyKey, {
                value,
                writable: true,
                configurable: true,
            })
        },
        configurable: true,
    })
}
