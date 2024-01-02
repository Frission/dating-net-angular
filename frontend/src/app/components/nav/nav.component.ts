import { AsyncPipe, TitleCasePipe } from "@angular/common"
import { Component } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { BsDropdownModule } from "ngx-bootstrap/dropdown"
import { LoginRequest } from "../../model/request/LoginRequest"
import { AccountService } from "../../services/account.service"
import { Router, RouterModule } from "@angular/router"
import { ToastrService } from "ngx-toastr"
import { environment } from "../../../environments/environment"

@Component({
    selector: "app-nav",
    standalone: true,
    imports: [FormsModule, BsDropdownModule, AsyncPipe, RouterModule, TitleCasePipe],
    templateUrl: "./nav.component.html",
    styleUrl: "./nav.component.scss",
})
export class NavComponent {
    model: LoginRequest = {
        username: "",
        password: "",
    }
    username: string = ""

    env = environment.env

    constructor(
        protected readonly accountService: AccountService,
        private readonly router: Router,
        private readonly toastr: ToastrService,
    ) {}

    login() {
        this.accountService
            .login({ username: this.model.username.trim(), password: this.model.password.trim() })
            .subscribe({
                next: () => {
                    this.router.navigateByUrl("/members")
                    this.toastr.success("Successfully logged in!")
                }
            })
    }

    logout() {
        this.accountService.logout()
        this.router.navigateByUrl("/")
        this.toastr.info("Successfully logged out.")
    }
}
