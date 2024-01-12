import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { BehaviorSubject, EMPTY, catchError, map, tap } from "rxjs"
import { LoginResponse } from "../model/response/LoginResponse"
import { LoginRequest } from "../model/request/LoginRequest"
import { User } from "../model/User"
import { RegisterRequest } from "../model/request/RegisterRequest"
import { environment } from "../../environments/environment"

@Injectable({ providedIn: "root" })
export class AccountService {
    private _currentUser = new BehaviorSubject<User | null>(null)
    get currentUser$() {
        return this._currentUser.asObservable()
    }

    private readonly baseUrl: string = environment.apiUrl
    private readonly localStorageKey = "user"

    constructor(private readonly httpClient: HttpClient) {}

    login(request: LoginRequest) {
        return this.httpClient.post<LoginResponse>(this.baseUrl + "account/login", request).pipe(
            catchError((err) => {
                console.error(err)
                throw err?.error?.errors?.credentials ?? "An error occurred while logging in."
            }),
            tap((response) => {
                if (response) {
                    localStorage.setItem(this.localStorageKey, JSON.stringify(response))
                    this.setCurrentUser(response)
                }
            }),
        )
    }

    logout() {
        localStorage.removeItem(this.localStorageKey)
        this._currentUser.next(null)
    }

    register(request: RegisterRequest) {
        return this.httpClient.post<LoginResponse>(this.baseUrl + "account/register", request).pipe(
            catchError((err) => {
                console.error(err)
                return EMPTY
            }),
            tap((response) => {
                if (response) {
                    localStorage.setItem(this.localStorageKey, JSON.stringify(response))
                    this.setCurrentUser(response)
                }
            }),
        )
    }

    onLoginSuccess(response: LoginResponse) {
        
    }

    checkCurrentUser() {
        const userJson = localStorage.getItem("user")
        if (userJson) {
            const user: User = JSON.parse(userJson)
            this.setCurrentUser(user)
        }
    }

    private setCurrentUser(user: User) {
        this._currentUser.next(user)
    }
}
