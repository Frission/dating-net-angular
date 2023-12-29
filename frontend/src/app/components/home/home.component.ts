import { Component, OnInit } from "@angular/core"
import { RegisterComponent } from "../register/register.component"
import { UserService } from "../../services/user.service"

@Component({
    selector: "app-home",
    standalone: true,
    imports: [RegisterComponent],
    templateUrl: "./home.component.html",
    styleUrl: "./home.component.scss",
})
export class HomeComponent implements OnInit {
    users: Array<{ id: string; userName: string }> | undefined
    registerMode: "showForm" | "hideForm" = "hideForm"

    constructor(private readonly userService: UserService) {}

    ngOnInit(): void {
        this.getUsers()
    }

    registerToggle() {
        this.registerMode = this.registerMode == "showForm" ? "hideForm" : "showForm"
    }

    getUsers() {
        this.userService.getUsers().subscribe({
            next: (response: Array<{ id: string; userName: string }> | unknown | undefined) => {
                // sanity check
                if (response == null || !Array.isArray(response)) return
                this.users = response
            },
            error: (err) => {
                console.log(err)
            },
        })
    }
}
