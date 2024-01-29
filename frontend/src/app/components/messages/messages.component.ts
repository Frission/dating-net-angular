import { Component, OnInit } from "@angular/core"
import { Message } from "../../model/response/Message"
import { Pagination } from "../../model/response/Pagination"
import { MessageContainer, MessagesService } from "../../services/messages.service"
import { PageChangedEvent, PaginationModule } from "ngx-bootstrap/pagination"
import { ButtonsModule } from "ngx-bootstrap/buttons"
import { FormsModule } from "@angular/forms"
import { TitleCasePipe } from "@angular/common"
import { TimeagoModule } from "ngx-timeago"
import { RouterModule } from "@angular/router"

@Component({
    selector: "app-messages",
    standalone: true,
    imports: [ButtonsModule, FormsModule, TitleCasePipe, TimeagoModule, PaginationModule, RouterModule],
    templateUrl: "./messages.component.html",
    styleUrl: "./messages.component.scss",
})
export class MessagesComponent implements OnInit {
    messages: Array<Message> | undefined
    pagination: Pagination | undefined
    container: MessageContainer = "Unread"
    pageNumber: number = 1
    pageSize: number = 5

    constructor(private readonly messageService: MessagesService) {}

    ngOnInit(): void {
        this.loadMessages()
    }

    loadMessages() {
        this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe({
            next: (response) => {
                this.messages = response.result
                this.pagination = response.pagination
            },
        })
    }

    pageChanged(event: PageChangedEvent) {
        if (this.pageNumber === event.page) return
        this.pageNumber = event.page
        this.loadMessages()
    }
}
