import { CommonModule, JsonPipe } from "@angular/common"
import { Component, EventEmitter, OnInit, Output } from "@angular/core"
import {
    AbstractControl,
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    ValidatorFn,
    Validators,
    ɵElement as FormField,
    ValidationErrors,
} from "@angular/forms"
import { AccountService } from "../../services/account.service"
import { TextInputComponent } from "../forms/text-input/text-input.component"
import { Observable, of } from "rxjs"

@Component({
    selector: "app-register",
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, JsonPipe, TextInputComponent],
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
        dateOfBirth: ["", [Validators.required]],
        city: ["", [Validators.required, Validators.minLength(2)]],
        country: ["", [Validators.required, Validators.minLength(2)]],
        password: ["", [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
        confirmPassword: ["", [Validators.required, this.matchValues("password")]],
    })

    constructor(
        private accountService: AccountService,
        private readonly formBuilder: FormBuilder,
    ) {
        this.registerForm.controls["password"].valueChanges.subscribe({
            next: () => this.registerForm.controls["confirmPassword"].updateValueAndValidity(),
        })
    }

    ngOnInit(): void {}

    matchValues(matchTo: "password"): ValidatorFn {
        return (control: AbstractControl): Observable<ValidationErrors | null> => {
            return control.value === control.parent?.get(matchTo)?.value ? of(null) : of({ notMatching: true })
        }
    }

    // this shuts typescript up
    getRegisterForm(): FormGroup {
        return this.registerForm
    }

    register() {
        console.log(this.registerForm?.value)
        // this.accountService.register(this.model).subscribe({
        //     next: this.cancel.bind(this)
        // })
    }

    cancel() {
        this.onCancelRegister.emit(false)
    }
}
