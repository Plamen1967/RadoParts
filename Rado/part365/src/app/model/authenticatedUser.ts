import { LoginErrorType } from "./enum/loginErrorType.enum"
import { UserType } from "./enum/userType.enum"

export class AuthenticatedUser {
    userId?: number
    userName?: string
    dealer?: UserType
    token?: string
    regionId?: number
    suspended?: number
    error?: LoginErrorType
}
