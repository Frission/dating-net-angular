import { AsyncPipe } from "@angular/common"
import { Component, OnInit } from "@angular/core"
import { Member } from "../../../model/response/Member"
import { Pagination } from "../../../model/response/Pagination"
import { MembersService } from "../../../services/members.service"
import { MemberCardComponent } from "../member-card/member-card.component"
import { PageChangedEvent, PaginationModule } from "ngx-bootstrap/pagination"
import { FormsModule } from "@angular/forms"
import { AccountService } from "../../../services/account.service"
import { UserParams } from "../../../model/local/UserParams"
import { Gender, User } from "../../../model/User"
import { take } from "rxjs"
import { ButtonsModule } from "ngx-bootstrap/buttons"

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
    genderList: Array<{ value: Gender; display: string }> = [
        { value: "male", display: "Male" },
        { value: "female", display: "Female" },
    ]

    protected get paginationParams(): UserParams | undefined {
        return this.memberService.paginationParams
    }
    protected set paginationParams(value: UserParams) {
        this.memberService.paginationParams = value
    }

    constructor(private readonly memberService: MembersService) {}

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

    resetFilters() {
        this.memberService.resetUserParams()
        this.loadMembers()
    }

    pageChanged(event: PageChangedEvent) {
        if (this.memberService.paginationParams?.pageNumber == event.page) return
        if (this.paginationParams?.pageSize == null) return
        this.paginationParams.pageNumber = event.page
        this.loadMembers()
    }
}
