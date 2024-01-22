import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { User } from "../model/User"
import { environment } from "../../environments/environment"
import { BaseService } from "./base/BaseService"

@Injectable({ providedIn: "root" })
export class UserService extends BaseService {
    constructor(private readonly httpClient: HttpClient) {
        super()
    }

    getUsers() {
        return this.httpClient.get<Array<User>>(this.baseUrl + "users")
    }
}
