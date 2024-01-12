import { PhotoResponse } from "./PhotoResponse"

export interface MemberResponse {
    id: number
    userName: string
    age?: number
    knownAs?: string
    photoUrl?: string
    created?: string
    lastActive?: string
    gender?: string 
    introduction?: string
    interests?: string
    city?: string
    country?: string
    photos: Array<PhotoResponse>
}


