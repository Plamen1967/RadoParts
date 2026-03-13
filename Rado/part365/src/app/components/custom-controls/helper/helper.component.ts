import { inject } from '@angular/core'
import { FormGroup } from '@angular/forms';
import { CONSTANT } from '@app/constant/globalLabels'
import { QueryParam } from '@model/queryParam';
import { AuthenticationService } from '@services/authentication/authentication.service'

export class HelperComponent {
    public authenticationService: AuthenticationService
    public formGroup!: FormGroup;
    public queryParams!: QueryParam;
    inialValue: undefined

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
    get changed() {
        return JSON.stringify(this.inialValue) !== JSON.stringify(this.formGroup.value)
    }

    // setNewId() {
    //     this.nextIdService.getNextId().then((nextId) => (this.partId = nextId))
    // }
    get currentYear() {
        const currentDate = new Date()
        return currentDate.getUTCFullYear()
    }
    get controls() {
        return this.formGroup?.controls
    }

        goTop() {
            document.querySelector('body')?.scrollTo(0, 0)
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant',
        })
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parseQueryParams(params: any) {
        this.queryParams = new QueryParam();
        this.queryParams.id = params.get('id')? +params.get('id') : undefined
        this.queryParams.query = params.get('query')? +params.get('query') : undefined
        this.queryParams.ad = params.get('ad') ? params.get('ad')! : undefined
        this.queryParams.update = params.get('update') ? params.get('update')! : undefined
        this.queryParams.itemType = params.get('itemType') ? +params.get('itemType') : undefined
        this.queryParams.userId = params.get('userId') ? +params.get('userId') : undefined
        this.queryParams.page = params.get('page') ? +params.get('page') : undefined
        this.queryParams.viewPartId = params.get('viewPartId') ? +params.get('viewPartId') : undefined
        this.queryParams.currentId = params.get('currentId') ? +params.get('currentId') : undefined
        this.queryParams.bus = params.get('bus') ? +params.get('bus') : undefined
        this.queryParams.activationcode = params.get('activationcode') ? params.get('activationcode')! : undefined
        this.queryParams.updateId = params.get('updateId') ? +params.get('updateId') : undefined
    }
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
