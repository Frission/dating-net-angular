import { Routes } from "@angular/router"
import { HomeComponent } from "./components/home/home.component"
import { ListsComponent } from "./components/lists/lists.component"
import { MemberDetailComponent } from "./components/members/member-detail/member-detail.component"
import { MemberListComponent } from "./components/members/member-list/member-list.component"
import { MessagesComponent } from "./components/messages/messages.component"

export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "members", component: MemberListComponent },
    { path: "members/:id", component: MemberDetailComponent },
    { path: "lists", component: ListsComponent },
    { path: "messages", component: MessagesComponent },
    { path: "**", component: HomeComponent, pathMatch: "full" },
]
