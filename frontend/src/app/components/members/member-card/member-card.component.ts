import { Component, Input } from "@angular/core"
import { RouterModule } from "@angular/router"
import { Member } from "../../../model/response/Member"
import { MembersService } from "../../../services/members.service"
import { ToastrService } from "ngx-toastr"

@Component({
    selector: "app-member-card",
    standalone: true,
    imports: [RouterModule],
    templateUrl: "./member-card.component.html",
    styleUrl: "./member-card.component.scss",
})
export class MemberCardComponent {
    @Input({ required: true }) member: Member | undefined

    constructor(private readonly memberService: MembersService, private readonly toastrService: ToastrService) {}

    addLike(member: Member) {
        this.memberService.addLike(member.userName).subscribe({
            next: () => this.toastrService.success("You have liked " + member.knownAs)
        })
    }
}
