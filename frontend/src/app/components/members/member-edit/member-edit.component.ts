import { Component, HostListener, OnInit, ViewChild } from "@angular/core"
import { FormsModule, NgForm } from "@angular/forms"
import { TabsModule } from "ngx-bootstrap/tabs"
import { ToastrService } from "ngx-toastr"
import { take } from "rxjs"
import { User } from "../../../model/User"
import { Member } from "../../../model/response/Member"
import { AccountService } from "../../../services/account.service"
import { MembersService } from "../../../services/members.service"

@Component({
    selector: "app-member-edit",
    standalone: true,
    imports: [FormsModule, TabsModule],
    templateUrl: "./member-edit.component.html",
    styleUrl: "./member-edit.component.scss",
})
export class MemberEditComponent implements OnInit {
    @ViewChild("editForm") editForm: NgForm | undefined
    @HostListener("window:beforeunload", ["$event"]) unloadNotification($event: any) {
        if (this.editForm?.dirty) {
            $event.returnValue = true
        }
    }

    member: Member | undefined
    user: User | null | undefined

    constructor(
        private readonly accountService: AccountService,
        private readonly memberService: MembersService,
        private readonly toastrService: ToastrService,
    ) {
        this.accountService.currentUser$.pipe(take(1)).subscribe({
            next: (user) => (this.user = user),
        })
    }

    ngOnInit(): void {
        this.loadMember()
    }

    loadMember() {
        if (this.user == null) return
        this.memberService.getMember(this.user.username).subscribe({
            next: (member) => (this.member = member),
        })
    }

    updateMember() {
        this.memberService.updateMember(this.editForm?.value).subscribe({
            next: () => {
                this.toastrService.success("Profile successfully updated!")
                this.editForm?.reset(this.member)
            },
            error: () => {
                this.toastrService.error("Failed up update profile.")
            },
        })
    }
}
