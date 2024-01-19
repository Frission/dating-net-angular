import { CommonModule, JsonPipe } from "@angular/common"
import { Component, EventEmitter, OnInit, Output } from "@angular/core"
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    ValidationErrors,
    ValidatorFn,
    Validators,
} from "@angular/forms"
import { Router, RouterModule } from "@angular/router"
import { of } from "rxjs"
import { RegisterRequest } from "../../model/request/RegisterRequest"
import { AccountService } from "../../services/account.service"
import { DatePickerComponent } from "../forms/date-picker/date-picker.component"
import { TextInputComponent } from "../forms/text-input/text-input.component"

@Component({
    selector: "app-register",
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        JsonPipe,
        TextInputComponent,
        DatePickerComponent,
        RouterModule,
    ],
    templateUrl: "./register.component.html",
    styleUrl: "./register.component.scss",
})
export class RegisterComponent implements OnInit {
    @Output() onCancelRegister = new EventEmitter<boolean>()

    model: { username: string; password: string } = {
        username: "",
        password: "",
    }

    registerForm = this.formBuilder.group({
        gender: ["male"],
        username: ["", [Validators.required, Validators.minLength(2)]],
        knownAs: ["", [Validators.required, Validators.minLength(2)]],
        dateOfBirth: ["", Validators.required],
        city: ["", [Validators.required, Validators.minLength(2)]],
        country: ["", [Validators.required, Validators.minLength(2)]],
        password: ["", [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
        confirmPassword: ["", [Validators.required, this.matchValues("password")]],
    })
    maxDate: Date = new Date()
    validationErrors: Array<string> | undefined

    constructor(
        private accountService: AccountService,
        private readonly formBuilder: FormBuilder,
        private router: Router,
    ) {
        this.maxDate.setFullYear(this.maxDate.getFullYear() - 18)
        this.registerForm.controls["password"].valueChanges.subscribe({
            next: () => this.registerForm.controls["confirmPassword"].updateValueAndValidity(),
        })
    }

    ngOnInit(): void {}

    matchValues(matchTo: "password"): ValidatorFn {
        return (control: AbstractControl): Record<string, boolean> | null => {
            return control.value === control.parent?.get(matchTo)?.value ? null : { notMatching: true }
        }
    }

    // this shuts typescript up
    getRegisterForm(): FormGroup {
        return this.registerForm
    }

    register() {
        const date = this.getDateOnly(this.registerForm.controls["dateOfBirth"].value)
        const values: RegisterRequest = { ...this.registerForm.value as RegisterRequest, dateOfBirth: date }
        console.log(values)
        this.accountService.register(values).subscribe({
            next: () => {
                this.router.navigateByUrl("/members")
            },
            error: (err) => {
                this.validationErrors = err
                console.error(err)
            },
        })
    }

    private getDateOnly(dateString: string | null | undefined): string {
        if (dateString == null) return ""
        let date = new Date(dateString)
        return new Date(date.setMinutes(date.getMinutes() - date.getTimezoneOffset())).toISOString().slice(0, 10)
    }

    cancel() {
        this.onCancelRegister.emit(false)
    }
}
