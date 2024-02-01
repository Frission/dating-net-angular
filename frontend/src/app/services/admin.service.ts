import { Injectable } from "@angular/core"
import { BaseService } from "./base/BaseService"
import { HttpClient } from "@angular/common/http"
import { User } from "../model/User"

@Injectable({
    providedIn: "root",
})
export class AdminService extends BaseService {
    constructor(private readonly httpClient: HttpClient) {
        super()
    }

    getUsersWithRoles() {
        return this.httpClient.get<Array<User>>(this.baseUrl + "admin/users-with-roles")
    }

    updateUserRoles(username: string, roles: Array<string>) {
        return this.httpClient.post<Array<string>>(
            this.baseUrl + "admin/edit-roles/" + username + "?roles=" + roles,
            {},
        )
    }
}
