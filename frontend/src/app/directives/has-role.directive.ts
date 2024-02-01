import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from "@angular/core"
import { AccountService } from "../services/account.service"
import { User } from "../model/User"
import { take } from "rxjs"

@Directive({
    selector: "[appHasRole]", // *appHasRole="['Admin', 'Moderator']"
    standalone: true,
})
export class HasRoleDirective implements OnInit {
    @Input() appHasRole: Array<string> = []
    user: User | undefined

    constructor(
        private readonly viewContainerRef: ViewContainerRef,
        private readonly templateRef: TemplateRef<unknown>,
        private readonly accountService: AccountService,
    ) {
        this.accountService.currentUser$.pipe(take(1)).subscribe({
            next: (user) => {
                if (user) this.user = user
            },
        })
    }

    ngOnInit(): void {
        if (this.user?.roles == null) return

        if (this.user.roles.some((role) => this.appHasRole.includes(role))) {
            this.viewContainerRef.createEmbeddedView(this.templateRef)
        } else {
            this.viewContainerRef.clear()
        }
    }
}
