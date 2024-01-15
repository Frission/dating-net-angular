import { Injectable } from "@angular/core"
import { environment } from "../../environments/environment"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Member } from "../model/response/Member"

@Injectable({
    providedIn: "root",
})
export class MembersService {
    private readonly baseUrl: string = environment.apiUrl

    constructor(private readonly httpClient: HttpClient) {}

    getMember(username: string) {
        return this.httpClient.get<Member>((this.baseUrl + "users/" + username))
    }

    getMembers() {
        return this.httpClient.get<Array<Member>>(this.baseUrl + "users")
    }
}
