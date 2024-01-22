import { AsyncPipe } from "@angular/common"
import { Component, OnInit } from "@angular/core"
import { Member } from "../../../model/response/Member"
import { Pagination } from "../../../model/response/Pagination"
import { MembersService } from "../../../services/members.service"
import { MemberCardComponent } from "../member-card/member-card.component"
import { PageChangedEvent, PaginationModule } from "ngx-bootstrap/pagination"
import { FormsModule } from "@angular/forms"
import { AccountService } from "../../../services/account.service"
import { PaginationParams } from "../../../model/local/PaginationParams"
import { User } from "../../../model/User"
import { take } from "rxjs"

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
    paginationParams: PaginationParams | undefined
    user: User | undefined

    constructor(
        private readonly memberService: MembersService,
        accountService: AccountService,
    ) {
        accountService.currentUser$.pipe(take(1)).subscribe({
            next: (user) => {
                if (user != null) {
                    this.paginationParams = new PaginationParams(user)
                    this.user = user
                }
            },
        })
    }

    ngOnInit(): void {
        this.loadMembers()
    }

    loadMembers() {
        if (this.paginationParams == null) return

        this.memberService.getMembers(this.paginationParams).subscribe({
            next: (response) => {
                if (response.result && response.pagination) {
                    this.members = response.result
                    this.pagination = response.pagination
                }
            },
        })
    }

    pageChanged(event: PageChangedEvent) {
        if (this.paginationParams?.pageNumber == event.page) return
        if (this.paginationParams?.pageSize == null) return
        this.paginationParams.pageSize = event.page
        this.loadMembers()
    }
}
