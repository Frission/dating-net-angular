import { CommonModule } from "@angular/common"
import { Component, Input, Self } from "@angular/core"
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from "@angular/forms"

@Component({
    selector: "app-text-input",
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: "./text-input.component.html",
    styleUrl: "./text-input.component.scss",
})
export class TextInputComponent implements ControlValueAccessor {
    @Input() label: string = ""
    @Input() type: HTMLInputElement["type"] = "text"

    constructor(@Self() public ngControl: NgControl) {
        this.ngControl.valueAccessor = this
    }

    writeValue(obj: unknown): void {}
    registerOnChange(fn: unknown): void {}
    registerOnTouched(fn: unknown): void {}
    
    get control(): FormControl {
        return this.ngControl.control as FormControl
    }
}
