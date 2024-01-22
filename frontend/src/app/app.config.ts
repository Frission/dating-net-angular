import { ApplicationConfig, importProvidersFrom } from "@angular/core"
import { provideRouter } from "@angular/router"

import { provideHttpClient, withInterceptors } from "@angular/common/http"
import { provideAnimations } from "@angular/platform-browser/animations"
import { provideToastr } from "ngx-toastr"
import { routes } from "./app.routes"
import { errorInterceptor } from "./interceptors/error.interceptor"
import { authInterceptor } from "./interceptors/auth.interceptor"
import { loadingInterceptor } from "./interceptors/loading.interceptor"
import { TimeagoModule } from "ngx-timeago"

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(withInterceptors([errorInterceptor, authInterceptor, loadingInterceptor])),
        provideAnimations(),
        provideToastr({ positionClass: "toast-bottom-right" }),
        importProvidersFrom(TimeagoModule.forRoot()),
    ],
}
