import { AsyncPipe, TitleCasePipe } from "@angular/common"
import { Component, OnInit } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { BsDropdownModule } from "ngx-bootstrap/dropdown"
import { LoginRequest } from "../../model/request/LoginRequest"
import { AccountService } from "../../services/account.service"
import { Router, RouterModule } from "@angular/router"
import { ToastrService } from "ngx-toastr"
import { environment } from "../../../environments/environment"
import { HasRoleDirective } from "../../directives/has-role.directive"

@Component({
    selector: "app-nav",
    standalone: true,
    imports: [FormsModule, BsDropdownModule, AsyncPipe, RouterModule, TitleCasePipe, HasRoleDirective],
    templateUrl: "./nav.component.html",
    styleUrl: "./nav.component.scss",
})
export class NavComponent implements OnInit {
    model: LoginRequest = {
        username: "",
        password: "",
    }
    username: string = ""
    photoUrl: string | undefined

    env = environment.env

    constructor(
        protected readonly accountService: AccountService,
        private readonly router: Router,
        private readonly toastr: ToastrService,
    ) {}

    ngOnInit(): void {
        this.accountService.currentUser$.subscribe({
            next: (user) => {
                if (user) {
                    this.photoUrl = user.photoUrl
                }
            },
        })
    }

    login() {
        this.accountService
            .login({ username: this.model.username.trim(), password: this.model.password.trim() })
            .subscribe({
                next: () => {
                    this.router.navigateByUrl("/members")
                    this.toastr.success("Successfully logged in!")
                },
            })
    }

    logout() {
        this.accountService.logout()
        this.router.navigateByUrl("/")
        this.toastr.info("Successfully logged out.")
    }
}
