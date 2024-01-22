import { HttpClient, HttpParams } from "@angular/common/http"
import { map } from "rxjs"
import { PaginatedResult } from "../../model/response/Pagination"
import { BaseService } from "./BaseService"

export abstract class PaginatedService<T, R extends Array<T> = Array<T>> extends BaseService {

    constructor(protected readonly httpClient: HttpClient) {
        super()
    }

    protected getPaginatedResult(url: string, params: HttpParams) {
        const paginatedResult: PaginatedResult<R> = new PaginatedResult<R>()

        return this.httpClient.get<R>(url, { observe: "response", params }).pipe(
            map((response) => {
                const pagination = response.headers.get("Pagination")
                if (response.body) paginatedResult.result = response.body
                if (pagination) paginatedResult.pagination = JSON.parse(pagination)
                return paginatedResult
            })
        )
    }

    protected getPaginationHeaders(pageNumber: number, pageSize: number) {
        let params = new HttpParams()
        params = params.append("pageNumber", pageNumber).append("pageSize", pageSize)
        return params
    }

}