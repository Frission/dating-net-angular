import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { of, tap } from "rxjs"
import { PaginationParams } from "../model/local/PaginationParams"
import { Member } from "../model/response/Member"
import { PaginatedService } from "./base/PaginatedService"

@Injectable({
    providedIn: "root",
})
export class MembersService extends PaginatedService<Member> {
    members: Array<Member> = []

    constructor(protected override readonly httpClient: HttpClient) {
        super(httpClient)
    }

    getMember(username: string) {
        const member = this.members.find((member) => member.userName == username)
        if (member) return of(member)
        return this.httpClient.get<Member>(this.baseUrl + "users/" + username)
    }

    getMembers(paginationParams: PaginationParams) {
        let params = this.getPaginationHeaders(paginationParams.pageNumber, paginationParams.pageSize)

        params = params.append("minAge", paginationParams.minAge)
        params = params.append("maxAge", paginationParams.maxAge)
        params = params.append("gender", paginationParams.gender)
        params = params.append("orderBy", paginationParams.orderBy)

        // if (this.members.length > 0) return of(this.members)
        return this.getPaginatedResult(this.baseUrl + "users", params)
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
