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
        return this.httpClient.get<MemberResponse>((this.baseUrl + "users/" + username), this.getHttpOptions())
    }

    getMembers() {
        return this.httpClient.get<Array<MemberResponse>>(this.baseUrl + "users", this.getHttpOptions())
    }

    // temporary
    private getHttpOptions(): Partial<Parameters<typeof this.httpClient.get>[1]> | undefined {
        const userString = localStorage.getItem("user")
        if (!userString) return
        const user: { token: string } = JSON.parse(userString)
        return {
            headers: new HttpHeaders({
                Authorization: `Bearer ${user.token}`,
            }),
        }
    }
}
