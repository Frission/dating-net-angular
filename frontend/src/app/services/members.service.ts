import { Injectable } from "@angular/core"
import { environment } from "../../environments/environment"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { MemberResponse } from "../model/response/MemberResponse"

@Injectable({
    providedIn: "root",
})
export class MembersService {
    private readonly baseUrl: string = environment.apiUrl

    constructor(private readonly httpClient: HttpClient) {}

    getMember(username: string) {
        return this.httpClient.get<MemberResponse>((this.baseUrl + "users/" + username))
    }

    getMembers() {
        return this.httpClient.get<Array<MemberResponse>>(this.baseUrl + "users")
    }
}
