import { Component } from "@angular/core"
import { environment } from "../../../environments/environment"
import { Router } from "@angular/router"

@Component({
    selector: "app-server-error",
    standalone: true,
    imports: [],
    templateUrl: "./server-error.component.html",
    styleUrl: "./server-error.component.scss",
})
export class ServerErrorComponent {
    env = environment.env
    error: any

    constructor(private readonly router: Router) {
        const navigation = this.router.getCurrentNavigation()
        this.error = navigation?.extras?.state?.["error"]
    }
}
