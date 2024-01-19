import { AsyncPipe } from "@angular/common"
import { Component, OnInit } from "@angular/core"
import { Member } from "../../../model/response/Member"
import { Pagination } from "../../../model/response/Pagination"
import { MembersService } from "../../../services/members.service"
import { MemberCardComponent } from "../member-card/member-card.component"
import { PageChangedEvent, PaginationModule } from "ngx-bootstrap/pagination"
import { FormsModule } from "@angular/forms"

@Component({
    selector: "app-member-list",
    standalone: true,
    imports: [MemberCardComponent, AsyncPipe, PaginationModule, FormsModule],
    templateUrl: "./member-list.component.html",
    styleUrl: "./member-list.component.scss",
})
export class MemberListComponent implements OnInit {
    members: Array<Member> = []
    pagination: Pagination | undefined
    pageNumber = 1
    pageSize = 5

    constructor(private readonly memberService: MembersService) {}

    ngOnInit(): void {
        this.loadMembers()
    }

    loadMembers() {
        this.memberService.getMembers(this.pageNumber, this.pageSize).subscribe({
            next: (response) => {
                if (response.result && response.pagination) {
                    this.members = response.result
                    this.pagination = response.pagination
                }
            },
        })
    }

    pageChanged(event: PageChangedEvent) {
        if (this.pageNumber == event.page) return
        this.pageNumber = event.page
        this.loadMembers()
    }
}
