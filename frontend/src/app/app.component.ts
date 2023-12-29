import { CommonModule } from "@angular/common"
import { HttpClientModule } from "@angular/common/http"
import { Component, OnInit } from "@angular/core"
import { RouterOutlet } from "@angular/router"
import { TooltipModule } from "ngx-bootstrap/tooltip"
import { HomeComponent } from "./components/home/home.component"
import { NavComponent } from "./components/nav/nav.component"
import { AccountService } from "./services/account.service"

@Component({
    selector: "app-root",
    standalone: true,
    imports: [CommonModule, RouterOutlet, HttpClientModule, TooltipModule, NavComponent, HomeComponent],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
    constructor(private readonly accountService: AccountService) {}

    ngOnInit() {
        this.accountService.checkCurrentUser()
    }
}
