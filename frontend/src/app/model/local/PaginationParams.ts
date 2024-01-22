import { Gender, User } from "../User"

export class PaginationParams {
    gender: Gender
    minAge: number = 18
    maxAge: number = 99
    pageNumber: number = 1
    pageSize: number = 5
    orderBy: "lastActive" | "created" = "lastActive"

    constructor(user: User) {
        this.gender = user.gender == "female" ? "male" : "female"
    }
}
