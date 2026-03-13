export class Message {
    id!: number
    sendUserId?: number
    receiveUserId?: number
    msgDate!: number
    message!: string
    previousMsgId?: number
    originalMsgId?: number
    partId?: number
    isCar?: number
    read?: number
    partDescription?: string
    modificationName?: string
    price?: number
    messageDateString?: string
}
