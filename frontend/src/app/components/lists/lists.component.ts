import { Component, OnInit } from "@angular/core"
import { Member } from "../../model/response/Member"
import { MembersService } from "../../services/members.service"
import { LikesPredicate } from "../../model/local/LikesPredicate"
import { FormsModule } from "@angular/forms"
import { MemberCardComponent } from "../members/member-card/member-card.component"
import { ButtonsModule } from "ngx-bootstrap/buttons"
import { Pagination } from "../../model/response/Pagination"
import { PageChangedEvent, PaginationModule } from "ngx-bootstrap/pagination"

@Component({
    selector: "app-lists",
    standalone: true,
    templateUrl: "./lists.component.html",
    styleUrl: "./lists.component.scss",
    imports: [FormsModule, MemberCardComponent, ButtonsModule, PaginationModule],
})
export class ListsComponent implements OnInit {
    members: Array<Member> | undefined
    predicate: LikesPredicate = "liked"
    pageNumber: number = 1
    pageSize: number = 5
    pagination: Pagination | undefined

    constructor(private readonly memberService: MembersService) {}

    ngOnInit(): void {
        this.loadLikes()
    }

    loadLikes() {
        this.memberService.getLikes(this.predicate, this.pageNumber, this.pageSize).subscribe({
            next: (response) => {
                this.members = response.result
                this.pagination = response.pagination
            },
        })
    }

    pageChanged(event: PageChangedEvent) {
        if (this.pageNumber == event.page) return
        this.pageNumber = event.page
        this.loadLikes()
    }
}
