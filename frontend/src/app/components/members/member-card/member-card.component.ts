import { Component, Input } from "@angular/core"
import { MemberResponse } from "../../../model/response/MemberResponse"

@Component({
    selector: "app-member-card",
    standalone: true,
    imports: [],
    templateUrl: "./member-card.component.html",
    styleUrl: "./member-card.component.scss",
})
export class MemberCardComponent {
    @Input({ required: true }) member: MemberResponse | undefined
}
