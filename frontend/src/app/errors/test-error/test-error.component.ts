import { HttpClient } from "@angular/common/http"
import { Component } from "@angular/core"

@Component({
    selector: "app-test-error",
    standalone: true,
    imports: [],
    templateUrl: "./test-error.component.html",
    styleUrl: "./test-error.component.scss",
})
export class TestErrorComponent {
    baseUrl = "https://localhost:5001/api/"
    validationErrors: Array<string> = []

    constructor(private readonly httpClient: HttpClient) {}

    get404Error() {
        this.httpClient.get(this.baseUrl + "buggy/not-found").subscribe({
            next: (response) => console.log(response),
            error: (err) => console.error(err),
        })
    }

    get400Error() {
        this.httpClient.get(this.baseUrl + "buggy/bad-request").subscribe({
            next: (response) => console.log(response),
            error: (err) => console.error(err),
        })
    }

    get500Error() {
        this.httpClient.get(this.baseUrl + "buggy/server-error").subscribe({
            next: (response) => console.log(response),
            error: (err) => console.error(err),
        })
    }

    get401Error() {
        this.httpClient.get(this.baseUrl + "buggy/auth").subscribe({
            next: (response) => console.log(response),
            error: (err) => console.error(err),
        })
    }

    get400ValidationError() {
        this.httpClient.post(this.baseUrl + "account/register", {}).subscribe({
            next: (response) => console.log(response),
            error: (err) => {
                console.error(err)
                this.validationErrors = err
            },
        })
    }
}
