import { Component, Input, OnInit } from "@angular/core"
import { Message } from "../../../model/response/Message"
import { MessagesService } from "../../../services/messages.service"
import { TimeagoModule } from "ngx-timeago"

@Component({
    selector: "app-member-messages",
    standalone: true,
    imports: [TimeagoModule],
    templateUrl: "./member-messages.component.html",
    styleUrl: "./member-messages.component.scss",
})
export class MemberMessagesComponent implements OnInit {
    @Input() username?: string
    messages: Array<Message> = []

    constructor(private readonly messageService: MessagesService) {}

    ngOnInit(): void {
        this.loadMessages()
    }

    loadMessages() {
        if (this.username) {
            this.messageService.getMessageThread(this.username).subscribe({
                next: (messages) => (this.messages = messages),
            })
        }
    }
}
