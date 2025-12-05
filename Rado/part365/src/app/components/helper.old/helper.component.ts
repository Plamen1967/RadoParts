import { CONSTANT } from "@app/constant/globalLabels"

export class HelperComponent {
    get labels() {
        return CONSTANT
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
