import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { BehaviorSubject, EMPTY, catchError, tap } from "rxjs"
import { User } from "../model/User"
import { LoginRequest } from "../model/request/LoginRequest"
import { RegisterRequest } from "../model/request/RegisterRequest"
import { LoginResponse } from "../model/response/LoginResponse"
import { BaseService } from "./base/BaseService"

@Injectable({ providedIn: "root" })
export class AccountService extends BaseService {
    private _currentUser = new BehaviorSubject<User | null>(null)
    get currentUser$() {
        return this._currentUser.asObservable()
    }

    private readonly localStorageKey = "user"

    constructor(private readonly httpClient: HttpClient) {
        super()
    }

    login(request: LoginRequest) {
        return this.httpClient.post<LoginResponse>(this.baseUrl + "account/login", request).pipe(
            catchError((err) => {
                console.error(err)
                throw err?.error?.errors?.credentials ?? "An error occurred while logging in."
            }),
            tap(this.onLoginSuccess.bind(this)),
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
            tap(this.onLoginSuccess.bind(this)),
        )
    }

    onLoginSuccess(response: LoginResponse) {
        if (response) {
            localStorage.setItem(this.localStorageKey, JSON.stringify(response))
            this.setCurrentUser(response)
        }
    }

    checkCurrentUser() {
        const userJson = localStorage.getItem("user")
        if (userJson) {
            const user: User = JSON.parse(userJson)
            this.setCurrentUser(user)
        }
    }

    setCurrentUser(user: User) {
        const roles = this.getDecodedToken(user.token).role

        if (roles != null) {
            if (Array.isArray(roles)) {
                user.roles = roles
            } else {
                user.roles = [roles]
            }
        }

        this._currentUser.next(user)
    }

    getDecodedToken(token: string) {
        return JSON.parse(atob(token.split(".")[1]))
    }
}
