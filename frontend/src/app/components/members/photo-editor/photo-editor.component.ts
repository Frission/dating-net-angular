import { Component, Input, OnInit } from "@angular/core"
import { Member } from "../../../model/response/Member"
import { FileUploadModule, FileUploader } from "ng2-file-upload"
import { CommonModule } from "@angular/common"
import { environment } from "../../../../environments/environment"
import { AccountService } from "../../../services/account.service"
import { take } from "rxjs"
import { User } from "../../../model/User"
import { Photo } from "../../../model/response/Photo"
import { MembersService } from "../../../services/members.service"

@Component({
    selector: "app-photo-editor",
    standalone: true,
    imports: [FileUploadModule, CommonModule],
    templateUrl: "./photo-editor.component.html",
    styleUrl: "./photo-editor.component.scss",
})
export class PhotoEditorComponent implements OnInit {
    @Input({ required: true }) member: Member | undefined

    protected uploader: FileUploader | undefined
    protected hasBaseDropZoneOver = false
    protected hasAnotherDropZoneOver = false
    private readonly baseUrl = environment.apiUrl
    private user: User | undefined

    constructor(
        private readonly accountService: AccountService,
        private readonly memberService: MembersService,
    ) {
        this.accountService.currentUser$.pipe(take(1)).subscribe({
            next: (user) => {
                if (user != null) this.user = user
            },
        })
    }

    ngOnInit(): void {
        this.initializeUploader()
    }

    setMainPhoto(photo: Photo) {
        this.memberService.setMainPhoto(photo.id).subscribe({
            next: () => {
                if (this.user && this.member) {
                    this.user.photoUrl = photo.url
                    this.member.photoUrl = photo.url
                    this.accountService.setCurrentUser(this.user)
                    this.member.photos.forEach((p) => {
                        if (p.isMain) p.isMain = false
                        if (p.id == photo.id) p.isMain = true
                    })
                }
            },
        })
    }

    fileOverBase(e: boolean) {
        this.hasBaseDropZoneOver = e
    }

    initializeUploader() {
        this.uploader = new FileUploader({
            url: this.baseUrl + "users/add-photo",
            authToken: `Bearer ${this.user?.token}`,
            isHTML5: true,
            allowedFileType: ["image"],
            removeAfterUpload: true,
            autoUpload: false,
            maxFileSize: 10 * 1024 * 1024,
        })

        this.uploader.onAfterAddingFile = (file) => {
            file.withCredentials = false
        }

        this.uploader.onSuccessItem = (item, response, status, headers) => {
            if (response) {
                const photo = JSON.parse(response)
                this.member?.photos.push(photo)
            }
        }
    }
}
