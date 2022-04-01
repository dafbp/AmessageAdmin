export interface IRoomInfo {
    _id: string
    fname: string
    description: string
    name: string
    t: 't' | 'p' | string
    msgs: number
    usersCount: number
    usernames: string[]
    u: U
    ro: boolean
    default: boolean
    announcement: string
    muted: any[]
    unmuted: string[]
    topic: string
    success: boolean
}

interface U {
    _id: string
    username: string
}
