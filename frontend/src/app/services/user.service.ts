import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { User } from "../model/User"

@Injectable({ providedIn: "root" })
export class UserService {
    private baseUrl: string = "https://localhost:5001/api/"

    constructor(private readonly httpClient: HttpClient) {}

    getUsers() {
        return this.httpClient.get<Array<User>>(this.baseUrl + "users")
    }
}
