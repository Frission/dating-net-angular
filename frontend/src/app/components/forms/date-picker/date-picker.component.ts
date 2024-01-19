import { CommonModule } from "@angular/common"
import { Component, Input, Self } from "@angular/core"
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from "@angular/forms"
import { BsDatepickerConfig, BsDatepickerModule, BsLocaleService } from "ngx-bootstrap/datepicker"
import { defineLocale } from "ngx-bootstrap/chronos"
import { enGbLocale } from "ngx-bootstrap/chronos"

defineLocale("en-gb", enGbLocale)

@Component({
    selector: "app-date-picker",
    standalone: true,
    imports: [BsDatepickerModule, ReactiveFormsModule, CommonModule],
    templateUrl: "./date-picker.component.html",
    styleUrl: "./date-picker.component.scss",
})
export class DatePickerComponent implements ControlValueAccessor {
    @Input() label: string = ""
    @Input() maxDate: Date | undefined

    bsConfig: Partial<BsDatepickerConfig> = {
        containerClass: "theme-red",
        dateInputFormat: "DD MMMM YYYY",
        showWeekNumbers: false,
    }

    constructor(
        @Self() public ngControl: NgControl,
        private readonly bsLocaleService: BsLocaleService,
    ) {
        this.bsLocaleService.use("en-gb")
        this.ngControl.valueAccessor = this
    }

    get control(): FormControl {
        return this.ngControl.control as FormControl
    }

    writeValue(obj: any): void {}
    registerOnChange(fn: any): void {}
    registerOnTouched(fn: any): void {}
    setDisabledState?(isDisabled: boolean): void {}
}
