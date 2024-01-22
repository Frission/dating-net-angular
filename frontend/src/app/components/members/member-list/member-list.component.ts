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
import { Gender, User } from "../../../model/User"
import { take } from "rxjs"
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@Component({
    selector: "app-member-list",
    standalone: true,
    imports: [MemberCardComponent, AsyncPipe, PaginationModule, FormsModule, ButtonsModule],
    templateUrl: "./member-list.component.html",
    styleUrl: "./member-list.component.scss",
})
export class MemberListComponent implements OnInit {
    members: Array<Member> = []
    pagination: Pagination | undefined
    paginationParams: PaginationParams | undefined
    user: User | undefined
    genderList: Array<{ value: Gender; display: string }> = [
        { value: "male", display: "Male" },
        { value: "female", display: "Female" },
    ]

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

    resetFilters () {
        if(this.user != null) {
            this.paginationParams = new PaginationParams(this.user)
        }
    }

    pageChanged(event: PageChangedEvent) {
        if (this.paginationParams?.pageNumber == event.page) return
        if (this.paginationParams?.pageSize == null) return
        this.paginationParams.pageNumber = event.page
        this.loadMembers()
    }
}
