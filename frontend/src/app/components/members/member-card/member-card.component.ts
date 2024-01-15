import { Component, Input } from "@angular/core"
import { RouterModule } from "@angular/router"
import { MemberResponse } from "../../../model/response/MemberResponse"

@Component({
    selector: "app-member-card",
    standalone: true,
    imports: [RouterModule],
    templateUrl: "./member-card.component.html",
    styleUrl: "./member-card.component.scss",
})
export class MemberCardComponent {
    @Input({ required: true }) member: MemberResponse | undefined
}
