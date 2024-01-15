import { ApplicationConfig } from "@angular/core"
import { provideRouter } from "@angular/router"

import { provideHttpClient, withInterceptors } from "@angular/common/http"
import { provideAnimations } from "@angular/platform-browser/animations"
import { provideToastr } from "ngx-toastr"
import { routes } from "./app.routes"
import { errorInterceptor } from "./interceptors/error.interceptor"
import { authInterceptor } from "./interceptors/auth.interceptor"

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(withInterceptors([errorInterceptor, authInterceptor])),
        provideAnimations(),
        provideToastr({ positionClass: "toast-bottom-right" }),
    ],
}
