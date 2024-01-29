import { Routes } from "@angular/router"
import { HomeComponent } from "./components/home/home.component"
import { NotFoundComponent } from "./errors/not-found/not-found.component"
import { ServerErrorComponent } from "./errors/server-error/server-error.component"
import { TestErrorComponent } from "./errors/test-error/test-error.component"
import { authGuard } from "./guards/auth.guard"
import { preventUnsavedChangesGuard } from "./guards/prevent-unsaved-changes.guard"
import { memberDetailedResolver } from "./resolvers/member-detailed.resolver"

export const routes: Routes = [
    { path: "", component: HomeComponent },
    {
        path: "",
        runGuardsAndResolvers: "always",
        canActivate: [authGuard],
        children: [
            {
                path: "members",
                loadComponent: () =>
                    import("./components/members/member-list/member-list.component").then((c) => c.MemberListComponent),
            },
            {
                path: "members/:username",
                resolve: { member: memberDetailedResolver },
                loadComponent: () =>
                    import("./components/members/member-detail/member-detail.component").then(
                        (c) => c.MemberDetailComponent,
                    ),
            },
            {
                path: "member/edit",
                loadComponent: () =>
                    import("./components/members/member-edit/member-edit.component").then((c) => c.MemberEditComponent),
                canDeactivate: [preventUnsavedChangesGuard],
            },
            {
                path: "lists",
                loadComponent: () => import("./components/lists/lists.component").then((c) => c.ListsComponent),
            },
            {
                path: "messages",
                loadComponent: () =>
                    import("./components/messages/messages.component").then((c) => c.MessagesComponent),
            },
        ],
    },
    { path: "errors", component: TestErrorComponent },
    { path: "not-found", component: NotFoundComponent },
    { path: "server-error", component: ServerErrorComponent },
    { path: "**", component: HomeComponent, pathMatch: "full" },
]
