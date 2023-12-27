import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { User } from "../model/User"
import { Observable } from "rxjs"

@Injectable({ providedIn: "root" })
export class UserService {
    constructor(private readonly httpClient: HttpClient) {}

    getUsers() {
        return this.httpClient.get<Array<User>>("https://localhost:5001/api/users")
    }
}
