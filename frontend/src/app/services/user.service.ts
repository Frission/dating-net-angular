import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { User } from "../model/User"
import { environment } from "../../environments/environment"

@Injectable({ providedIn: "root" })
export class UserService {
    private readonly baseUrl: string = environment.apiUrl

    constructor(private readonly httpClient: HttpClient) {}

    getUsers() {
        return this.httpClient.get<Array<User>>(this.baseUrl + "users")
    }
}
