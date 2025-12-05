import { PartView } from "./part/partView"

export class CheckoutItem {
    id?: number
    userId?: number
    partId?: number
    price?: number
    captureTime?: Date
    part?: PartView
    isCar?: boolean
}

export class Checkout {
    items: CheckoutItem[] = []
}
