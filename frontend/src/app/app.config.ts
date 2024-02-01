import { ApplicationConfig, importProvidersFrom } from "@angular/core"
import { provideRouter } from "@angular/router"

import { provideHttpClient, withInterceptors } from "@angular/common/http"
import { provideAnimations } from "@angular/platform-browser/animations"
import { TimeagoModule } from "ngx-timeago"
import { provideToastr } from "ngx-toastr"
import { routes } from "./app.routes"
import { authInterceptor } from "./interceptors/auth.interceptor"
import { errorInterceptor } from "./interceptors/error.interceptor"
import { loadingInterceptor } from "./interceptors/loading.interceptor"

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(withInterceptors([errorInterceptor, authInterceptor, loadingInterceptor])),
        provideAnimations(),
        provideToastr({ positionClass: "toast-bottom-right" }),
        importProvidersFrom(TimeagoModule.forRoot()),
    ],
}
