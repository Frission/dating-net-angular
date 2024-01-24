import { Component, OnInit } from "@angular/core"
import { Member } from "../../model/response/Member"
import { MembersService } from "../../services/members.service"
import { LikesPredicate } from "../../model/local/LikesPredicate"
import { FormsModule } from "@angular/forms"
import { MemberCardComponent } from "../members/member-card/member-card.component"
import { ButtonsModule } from "ngx-bootstrap/buttons"

@Component({
    selector: "app-lists",
    standalone: true,
    templateUrl: "./lists.component.html",
    styleUrl: "./lists.component.scss",
    imports: [FormsModule, MemberCardComponent, ButtonsModule],
})
export class ListsComponent implements OnInit {
    members: Array<Member> | undefined
    predicate: LikesPredicate = "liked"

    constructor(private readonly memberService: MembersService) {}

    ngOnInit(): void {
        this.loadLikes()
    }

    loadLikes() {
        this.memberService.getLikes(this.predicate).subscribe({
            next: (members) => (this.members = members),
        })
    }
}
