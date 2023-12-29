import { AsyncPipe } from "@angular/common"
import { Component } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { BsDropdownModule } from "ngx-bootstrap/dropdown"
import { LoginRequest } from "../../model/request/LoginRequest"
import { AccountService } from "../../services/account.service"

@Component({
    selector: "app-nav",
    standalone: true,
    imports: [FormsModule, BsDropdownModule, AsyncPipe],
    templateUrl: "./nav.component.html",
    styleUrl: "./nav.component.scss",
})
export class NavComponent {
    model: LoginRequest = {
        username: "",
        password: "",
    }
    username: string = ""

    constructor(protected readonly accountService: AccountService) {}

    login() {
        this.accountService.login(this.model).subscribe()
    }

    logout() {
        this.accountService.logout()
    }
}
