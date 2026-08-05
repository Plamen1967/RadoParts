import { DisplayPartView } from "@model/displayPartView"
import { UpdateEnum } from "@model/enum/update.enum"

export  class AddCarParam {
    bus? : number | undefined
    carId? : number | undefined
    add?  = false
    update?  = false
    mode? : UpdateEnum = UpdateEnum.New
    displayPartView? : DisplayPartView | undefined
}    