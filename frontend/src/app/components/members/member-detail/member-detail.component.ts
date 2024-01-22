import { Component, OnInit } from "@angular/core"
import { Member } from "../../../model/response/Member"
import { MembersService } from "../../../services/members.service"
import { ActivatedRoute } from "@angular/router"
import { TabsModule } from "ngx-bootstrap/tabs"
import { GalleryItem, GalleryModule, ImageItem } from "ng-gallery"
import { DatePipe } from "@angular/common"
import { TimeagoModule } from "ngx-timeago";

@Component({
    selector: "app-member-detail",
    standalone: true,
    imports: [TabsModule, GalleryModule, DatePipe, TimeagoModule],
    templateUrl: "./member-detail.component.html",
    styleUrl: "./member-detail.component.scss",
})
export class MemberDetailComponent implements OnInit {
    member: Member | undefined
    images: Array<GalleryItem> = []

    constructor(
        private readonly memberService: MembersService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.loadMember()
    }

    loadMember() {
        const username = this.route.snapshot.paramMap.get("username")

        if (username == null || typeof username !== "string") {
            console.warn("could not find the username parameter")
            return
        }

        this.memberService.getMember(username).subscribe({
            next: (user) => {
                this.member = user
                this.getImages()
            },
        })
    }

    getImages() {
        if (this.member == null) return
        for (const photo of this.member.photos) {
            this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }))
        }
    }
}
