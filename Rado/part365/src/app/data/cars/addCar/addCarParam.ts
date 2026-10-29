import { DisplayPartView } from "@model/displayPartView"
import { UpdateEnum } from "@model/enum/update.enum"

export  class AddItemParam {
    bus? : number | undefined
    id? : number | undefined
    add?  = false
    update?  = false
    carId? : number
    mode? : UpdateEnum = UpdateEnum.New
    displayPartView? : DisplayPartView | undefined
}    