import { UserType } from "./enum/userType.enum";
import { UserView } from "./userView";


export class User extends UserView {
    email?              : string; 
    userName?           : string;
    dealer?             : UserType;
    creationDate?       : string;
    suspended?          : number;
    suspendedDateTime?  : number;
    blocked?            : number;
    activated?          : number;
    carCount?           : number;
    partCount?          : number;
}