import { Component, OnInit } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { BsModalRef } from "ngx-bootstrap/modal"

@Component({
    selector: "app-roles-modal",
    standalone: true,
    imports: [FormsModule],
    templateUrl: "./roles-modal.component.html",
    styleUrl: "./roles-modal.component.scss",
})
export class RolesModalComponent implements OnInit, RolesModalState {
    public username: string = ""
    public availableRoles: Array<any> = []
    public selectedRoles: Array<any> = []
    public closeBtnName: string = "Close"

    constructor(protected bsModalRef: BsModalRef) {}

    ngOnInit(): void {}

    updateChecked(checkedValue: string) {
        const index = this.selectedRoles.indexOf(checkedValue)

        if (index != -1) {
            this.selectedRoles.splice(index, 1)
        } else {
            this.selectedRoles.push(checkedValue)
        }
    }
}

export interface RolesModalState {
    username: string
    availableRoles: Array<any>
    selectedRoles?: Array<any>
    closeBtnName?: string
}
