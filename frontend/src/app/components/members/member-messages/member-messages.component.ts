import { Component, Input, ViewChild } from "@angular/core"
import { TimeagoModule } from "ngx-timeago"
import { MessagesService } from "../../../services/messages.service"
import { Message } from "../../../model/response/Message"
import { FormsModule, NgForm } from "@angular/forms"

@Component({
    selector: "app-member-messages",
    standalone: true,
    imports: [TimeagoModule, FormsModule],
    templateUrl: "./member-messages.component.html",
    styleUrl: "./member-messages.component.scss",
})
export class MemberMessagesComponent {
    @ViewChild("messageForm") messageForm?: NgForm

    @Input() username: string = ""
    @Input({ required: true }) messages: Array<Message> = []
    messageContent = ""

    constructor(private readonly messageService: MessagesService) {}

    sendMessage() {
        if (!this.username) return
        this.messageService.sendMessage({ recipientUsername: this.username, content: this.messageContent }).subscribe({
            next: (message) => {
                this.messages.push(message)
                this.messageForm?.reset()
            },
        })
    }
}
