import { HttpClient, HttpParams } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { map, of, tap } from "rxjs"
import { environment } from "../../environments/environment"
import { Member } from "../model/response/Member"
import { PaginatedResult } from "../model/response/Pagination"

@Injectable({
    providedIn: "root",
})
export class MembersService {
    members: Array<Member> = []
    private paginatedResult: PaginatedResult<Array<Member>> = new PaginatedResult<Array<Member>>()

    private readonly baseUrl: string = environment.apiUrl

    constructor(private readonly httpClient: HttpClient) {}

    getMember(username: string) {
        const member = this.members.find((member) => member.userName == username)
        if (member) return of(member)
        return this.httpClient.get<Member>(this.baseUrl + "users/" + username)
    }

    getMembers(page?: number, itemsPerPage?: number) {
        let params = new HttpParams()

        if (page && itemsPerPage) {
            params = params.append("pageNumber", page).append("pageSize", itemsPerPage)
        }

        // if (this.members.length > 0) return of(this.members)
        return this.httpClient.get<Array<Member>>(this.baseUrl + "users", { observe: "response", params }).pipe(
            map((response) => {
                const pagination = response.headers.get("Pagination")

                if (response.body) this.paginatedResult.result = response.body
                if (pagination) this.paginatedResult.pagination = JSON.parse(pagination)
                return this.paginatedResult
            }),
        )
    }

    updateMember(member: Member) {
        return this.httpClient.put(this.baseUrl + "users", member).pipe(
            tap(() => {
                const index = this.members.indexOf(member)
                this.members[index] = { ...this.members[index], ...member }
            }),
        )
    }

    setMainPhoto(photoId: number) {
        return this.httpClient.put(this.baseUrl + "users/set-main-photo/" + photoId, {})
    }

    deletePhoto(photoId: number) {
        return this.httpClient.delete(this.baseUrl + "delete-photo/" + photoId)
    }
}
