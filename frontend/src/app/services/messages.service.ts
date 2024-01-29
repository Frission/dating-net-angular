import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs"
import { Message } from "../model/response/Message"
import { PaginatedResult } from "../model/response/Pagination"
import { PaginatedService } from "./base/PaginatedService"

@Injectable({
    providedIn: "root",
})
export class MessagesService extends PaginatedService {
    constructor(protected override readonly httpClient: HttpClient) {
        super(httpClient)
    }

    getMessages(
        pageNumber: number,
        pageSize: number,
        container: MessageContainer,
    ): Observable<PaginatedResult<Array<Message>>> {
        let params = this.getPaginationHeaders(pageNumber, pageSize)

        if (container) params = params.append("container", container)

        return this.getPaginatedResult<Array<Message>>(this.baseUrl + "messages", params)
    }

    getMessageThread(username: string): Observable<Array<Message>> {
        return this.httpClient.get<Array<Message>>(this.baseUrl + "messages/thread/" + username)
    }
}

export type MessageContainer = "Unread" | "Inbox" | "Outbox"
