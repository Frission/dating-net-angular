import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterOutlet } from "@angular/router"
import { HttpClientModule } from "@angular/common/http"
import { User } from "./model/User"
import { UserService } from "./services/UserService"
import { TooltipModule } from "ngx-bootstrap/tooltip"

@Component({
    selector: "app-root",
    standalone: true,
    imports: [CommonModule, RouterOutlet, HttpClientModule, TooltipModule],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
    users: Array<User> | undefined

    constructor(private readonly userService: UserService) {}

    ngOnInit(): void {
        this.userService.getUsers().subscribe({
            next: (response: Array<User> | unknown | undefined) => {
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
