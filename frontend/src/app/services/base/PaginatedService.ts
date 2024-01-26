import { HttpClient, HttpParams } from "@angular/common/http"
import { map } from "rxjs"
import { PaginatedResult } from "../../model/response/Pagination"
import { BaseService } from "./BaseService"

export abstract class PaginatedService extends BaseService {
    constructor(protected readonly httpClient: HttpClient) {
        super()
    }

    protected getPaginatedResult<T extends Array<any>>(url: string, params: HttpParams) {
        const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>()

        return this.httpClient.get<T>(url, { observe: "response", params }).pipe(
            map((response) => {
                const pagination = response.headers.get("Pagination")
                if (response.body) paginatedResult.result = response.body
                if (pagination) paginatedResult.pagination = JSON.parse(pagination)
                return paginatedResult
            }),
        )
    }

    protected getPaginationHeaders(pageNumber: number, pageSize: number) {
        let params = new HttpParams()
        params = params.append("pageNumber", pageNumber).append("pageSize", pageSize)
        return params
    }
}
