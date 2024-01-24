import { Gender, User } from "../User"
import { PaginationParams } from "./PaginationParams"

export class UserParams extends PaginationParams {
    gender: Gender
    minAge: number = 18
    maxAge: number = 99
    orderBy: "lastActive" | "created" = "lastActive"

    constructor(user: User) {
        super()
        this.gender = user.gender == "female" ? "male" : "female"
    }
}
