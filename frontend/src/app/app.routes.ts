import { Routes } from "@angular/router"
import { HomeComponent } from "./components/home/home.component"
import { ListsComponent } from "./components/lists/lists.component"
import { MemberDetailComponent } from "./components/members/member-detail/member-detail.component"
import { MemberListComponent } from "./components/members/member-list/member-list.component"
import { MessagesComponent } from "./components/messages/messages.component"
import { authGuard } from "./guards/auth.guard"
import { TestErrorComponent } from "./errors/test-error/test-error.component"
import { NotFoundComponent } from "./errors/not-found/not-found.component"
import { ServerErrorComponent } from "./errors/server-error/server-error.component"
import { MemberEditComponent } from "./components/members/member-edit/member-edit.component"
import { preventUnsavedChangesGuard } from "./guards/prevent-unsaved-changes.guard"

export const routes: Routes = [
    { path: "", component: HomeComponent },
    {
        path: "",
        runGuardsAndResolvers: "always",
        canActivate: [authGuard],
        children: [
            { path: "members", component: MemberListComponent },
            { path: "members/:username", component: MemberDetailComponent },
            { path: "member/edit", component: MemberEditComponent, canDeactivate: [preventUnsavedChangesGuard] },
            { path: "lists", component: ListsComponent },
            { path: "messages", component: MessagesComponent },
        ],
    },
    { path: "errors", component: TestErrorComponent },
    { path: "not-found", component: NotFoundComponent },
    { path: "server-error", component: ServerErrorComponent },
    { path: "**", component: HomeComponent, pathMatch: "full" },
]
