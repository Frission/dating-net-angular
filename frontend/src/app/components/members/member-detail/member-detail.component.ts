import { Component, OnInit, ViewChild } from "@angular/core"
import { Member } from "../../../model/response/Member"
import { MembersService } from "../../../services/members.service"
import { ActivatedRoute } from "@angular/router"
import { TabDirective, TabsModule, TabsetComponent } from "ngx-bootstrap/tabs"
import { GalleryItem, GalleryModule, ImageItem } from "ng-gallery"
import { DatePipe } from "@angular/common"
import { TimeagoModule } from "ngx-timeago"
import { MemberMessagesComponent } from "../member-messages/member-messages.component"
import { MessagesService } from "../../../services/messages.service"
import { Message } from "../../../model/response/Message"

@Component({
    selector: "app-member-detail",
    standalone: true,
    templateUrl: "./member-detail.component.html",
    styleUrl: "./member-detail.component.scss",
    imports: [TabsModule, GalleryModule, DatePipe, TimeagoModule, MemberMessagesComponent],
})
export class MemberDetailComponent implements OnInit {
    @ViewChild("memberTabs", { static: true }) memberTabs?: TabsetComponent
    activeTab?: TabDirective
    member: Member = {} as Member;
    images: Array<GalleryItem> = []
    messages: Array<Message> = []

    constructor(
        private readonly memberService: MembersService,
        private readonly messagesService: MessagesService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.route.data.subscribe({
            next: (data) => (this.member = data["member"]),
        })

        this.route.queryParams.subscribe({
            next: (params) => {
                if (params["tab"]) {
                    this.selectTab(params["tab"])
                }
            },
        })

        this.getImages()
    }

    selectTab(heading: "Messages") {
        if (this.memberTabs) {
            const tab = this.memberTabs.tabs.find((tab) => tab.heading == heading)
            console.log(this.memberTabs)
            if (tab != null) {
                tab.active = true
            }
        }
    }

    onTabActivated(data: TabDirective) {
        this.activeTab = data
        if (this.activeTab.heading == "Messages") {
            this.loadMessages()
        }
    }

    // loadMember() {
    //     const username = this.route.snapshot.paramMap.get("username")

    //     if (username == null || typeof username !== "string") {
    //         console.warn("could not find the username parameter")
    //         return
    //     }

    //     this.memberService.getMember(username).subscribe({
    //         next: (user) => {
    //             this.member = user
    //             this.getImages()
    //         },
    //     })
    // }

    loadMessages() {
        if (this.member?.userName) {
            this.messagesService.getMessageThread(this.member.userName).subscribe({
                next: (messages) => (this.messages = messages),
            })
        }
    }

    getImages() {
        if (this.member == null) return
        for (const photo of this.member.photos) {
            this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }))
        }
    }
}
