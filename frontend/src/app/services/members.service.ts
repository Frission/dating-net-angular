import { Injectable } from "@angular/core"
import { environment } from "../../environments/environment"
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { Member } from "../model/response/Member"
import { of, tap } from "rxjs"

@Injectable({
    providedIn: "root",
})
export class MembersService {
    members: Array<Member> = []

    private readonly baseUrl: string = environment.apiUrl

    constructor(private readonly httpClient: HttpClient) {}

    getMember(username: string) {
        const member = this.members.find((member) => member.userName == username)
        if (member) return of(member)
        return this.httpClient.get<Member>(this.baseUrl + "users/" + username)
    }

    getMembers() {
        if (this.members.length > 0) return of(this.members)
        return this.httpClient
            .get<Array<Member>>(this.baseUrl + "users")
            .pipe(tap((members) => (this.members = members)))
    }

    updateMember(member: Member) {
        return this.httpClient.put(this.baseUrl + "users", member).pipe(
            tap(() => {
                const index = this.members.indexOf(member)
                this.members[index] = { ...this.members[index], ...member }
            }),
        )
    }
}
