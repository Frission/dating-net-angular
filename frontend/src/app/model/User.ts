export interface User {
    username: string
    token: string
    photoUrl?: string
    knownAs?: string
    gender?: Gender
}

export type Gender = "male" | "female"
