import { Component, OnInit } from "@angular/core"
import { Member } from "../../../model/response/Member"
import { MembersService } from "../../../services/members.service"
import { MemberCardComponent } from "../member-card/member-card.component"

@Component({
    selector: "app-member-list",
    standalone: true,
    imports: [MemberCardComponent],
    templateUrl: "./member-list.component.html",
    styleUrl: "./member-list.component.scss",
})
export class MemberListComponent implements OnInit {
    members: Array<Member> = []

    constructor(private readonly memberService: MembersService) {}

    ngOnInit(): void {
        this.loadMembers()
    }

    loadMembers() {
        this.memberService.getMembers().subscribe({
            next: (members) => (this.members = members),
        })
    }
}
