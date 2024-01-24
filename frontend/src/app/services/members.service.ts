import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable, of, take, tap } from "rxjs"
import { UserParams } from "../model/local/UserParams"
import { Member } from "../model/response/Member"
import { PaginatedService } from "./base/PaginatedService"
import { PaginatedResult } from "../model/response/Pagination"
import { AccountService } from "./account.service"
import { User } from "../model/User"
import { LikesPredicate } from "../model/local/LikesPredicate"

@Injectable({
    providedIn: "root",
})
export class MembersService extends PaginatedService {
    members: Array<Member> = []
    memberCache = new Map<string, PaginatedResult<Array<Member>>>()
    user: User | undefined

    private _paginationParams: UserParams | undefined
    get paginationParams(): UserParams | undefined {
        return this._paginationParams
    }
    set paginationParams(value: UserParams) {
        this._paginationParams = value
    }

    constructor(
        protected override readonly httpClient: HttpClient,
        accountService: AccountService,
    ) {
        super(httpClient)
        accountService.currentUser$.pipe(take(1)).subscribe({
            next: (user) => {
                if (user != null) {
                    this.paginationParams = new UserParams(user)
                    this.user = user
                }
            },
        })
    }

    getMember(username: string): Observable<Member> {
        const member = [...this.memberCache.values()]
            .flatMap((p) => (p.result ? [...p.result] : []))
            .find((member) => member.userName == username)

        if (member) return of(member)

        return this.httpClient.get<Member>(this.baseUrl + "users/" + username)
    }

    getMembers(paginationParams: UserParams): Observable<PaginatedResult<Array<Member>>> {
        const response = this.memberCache.get(this.getCacheKey(paginationParams))

        if (response) return of(response)

        let params = this.getPaginationHeaders(paginationParams.pageNumber, paginationParams.pageSize)

        params = params.append("minAge", paginationParams.minAge)
        params = params.append("maxAge", paginationParams.maxAge)
        params = params.append("gender", paginationParams.gender)
        params = params.append("orderBy", paginationParams.orderBy)

        // if (this.members.length > 0) return of(this.members)
        return this.getPaginatedResult<Member>(this.baseUrl + "users", params).pipe(
            tap((members) => {
                if (members != null) this.memberCache.set(this.getCacheKey(paginationParams), members)
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

    addLike(username: string) {
        return this.httpClient.post(this.baseUrl + "likes/" + username, {})
    }

    getLikes(predicate: LikesPredicate, pageNumber: number, pageSize: number) {
        let params = this.getPaginationHeaders(pageNumber, pageSize)

        params = params.append("predicate", predicate)

        return this.getPaginatedResult<Member>(this.baseUrl + "likes", params)
    }

    resetUserParams() {
        if (this.user != null) {
            this.paginationParams = new UserParams(this.user)
        }
    }

    private getCacheKey(paginationParams: UserParams): string {
        return Object.values(paginationParams).join("-")
    }
}
