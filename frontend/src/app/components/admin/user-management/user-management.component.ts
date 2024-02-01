import { Component, OnInit } from "@angular/core"
import { AdminService } from "../../../services/admin.service"
import { User } from "../../../model/User"
import { BsModalRef, BsModalService, ModalModule, ModalOptions } from "ngx-bootstrap/modal"
import { RolesModalComponent, RolesModalState } from "../../modals/roles-modal/roles-modal.component"

@Component({
    selector: "app-user-management",
    standalone: true,
    imports: [ModalModule],
    templateUrl: "./user-management.component.html",
    styleUrl: "./user-management.component.scss",
})
export class UserManagementComponent implements OnInit {
    users: Array<User> = []
    modalRef: BsModalRef<RolesModalComponent> = new BsModalRef<RolesModalComponent>()
    availableRoles = ["Admin", "Moderator", "Member"]

    constructor(
        private readonly adminService: AdminService,
        private readonly modalService: BsModalService,
    ) {}

    ngOnInit(): void {
        this.getUsersWithRoles()
    }

    getUsersWithRoles() {
        this.adminService.getUsersWithRoles().subscribe({
            next: (users) => (this.users = users),
        })
    }

    openRolesModal(user: User) {
        const config: ModalOptions<RolesModalComponent> = {
            class: "modal-dialog-centered",
            initialState: {
                username: user.username,
                availableRoles: this.availableRoles,
                selectedRoles: [...(user.roles ?? [])],
            } satisfies RolesModalState,
        }
        this.modalRef = this.modalService.show(RolesModalComponent, config)
        if (this.modalRef.content != null) this.modalRef.content.closeBtnName = "Close"
        this.modalRef.onHide?.subscribe({
            next: () => {
                const selectedRoles = this.modalRef.content?.selectedRoles
                if (
                    Array.isArray(selectedRoles) &&
                    Array.isArray(user.roles) &&
                    !this.arraysAreEqual(selectedRoles, user.roles)
                ) {
                    this.adminService.updateUserRoles(user.username, selectedRoles).subscribe({
                        next: (roles) => (user.roles = roles),
                    })
                }
            },
        })
    }

    private arraysAreEqual(arr1: Array<unknown>, arr2: Array<unknown>): boolean {
        return JSON.stringify(arr1.sort()) === JSON.stringify(arr2.sort())
    }
}
