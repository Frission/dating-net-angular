import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http"
import { inject } from "@angular/core"
import { NavigationExtras, Router } from "@angular/router"
import { ToastrService } from "ngx-toastr"
import { catchError } from "rxjs"

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router)
    const toastr = inject(ToastrService)

    return next(req).pipe(
        catchError((err: HttpErrorResponse) => {
            if (err == null) throw new Error("caught an empty error?")

            switch (err.status) {
                case 400:
                    if (err.error?.errors) {
                        const modelStateErrors = Object.values(err.error.errors)
                        throw modelStateErrors.flat()
                    } else {
                        toastr.error(err.error, err.status.toString())
                    }
                    break
                case 401:
                    toastr.error("Unauthorized", err.status.toString())
                    break
                case 404:
                    router.navigateByUrl("/not-found")
                    break
                case 500:
                    const navigationExtras: NavigationExtras = { state: { error: err.error } }
                    router.navigateByUrl("/server-error", navigationExtras)
                    break
                default:
                    toastr.error("Something unexpected went wrong")
                    console.error(err)
                    break
            }

            throw err
        }),
    )
}
