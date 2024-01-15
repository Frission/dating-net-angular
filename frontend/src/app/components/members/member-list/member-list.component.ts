import { Component, OnInit } from "@angular/core"
import { Member } from "../../../model/response/Member"
import { MembersService } from "../../../services/members.service"
import { MemberCardComponent } from "../member-card/member-card.component"
import { Observable } from "rxjs"
import { AsyncPipe } from "@angular/common"

@Component({
    selector: "app-member-list",
    standalone: true,
    imports: [MemberCardComponent, AsyncPipe],
    templateUrl: "./member-list.component.html",
    styleUrl: "./member-list.component.scss",
})
export class MemberListComponent implements OnInit {
    members$: Observable<Array<Member>> | undefined

    constructor(private readonly memberService: MembersService) {}

    ngOnInit(): void {
        this.members$ = this.memberService.getMembers()
    }
}
