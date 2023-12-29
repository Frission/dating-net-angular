import { Component, EventEmitter, Input, Output } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { AccountService } from "../../services/account.service"

@Component({
    selector: "app-register",
    standalone: true,
    imports: [FormsModule],
    templateUrl: "./register.component.html",
    styleUrl: "./register.component.scss",
})
export class RegisterComponent {
    @Output() onCancelRegister = new EventEmitter<boolean>()

    model: { username: string; password: string } = {
        username: "",
        password: "",
    }

    constructor(private accountService: AccountService) {}

    register() {
        this.accountService.register(this.model).subscribe({
            next: this.cancel.bind(this)
        })
    }

    cancel() {
        this.onCancelRegister.emit(false)
    }
}
