export interface User {
    username: string
    token: string
    photoUrl?: string
    knownAs?: string
    gender?: Gender
    roles?: Array<string>
}

export type Gender = "male" | "female"
