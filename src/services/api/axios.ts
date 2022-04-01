import axios from 'axios'
import { request } from 'umi'

export const domain = 'https://chat.altisss.vn/api/v1/'

declare type TRoom = {
    default: boolean
    fname: string
    msgs: number
    name: string
    ro: boolean
    t: 'p' | 'c' | 'd' | 'teams'
    teamId: string
    teamMain: boolean
    u: { _id: string; username: string }
    usersCount: number
    _id: string
}

export const config = {
    headers: {
        'X-Auth-Token': 'PYNShde9ceaSFm-E2g5PpHmdLoHsq4sHA8Ef3iK8Zsq',
        'X-User-Id': 'rwD8GRfHhDTAPXvvF',
        'X-Requested-With': 'XMLHttpRequest',
        Accept: '*/*',
    },
}
// axios.head('https://chat.altisss.vn', config)

export const API_CHAT = {
    postMessage: async (roomId: string, text: string) => {
        try {
            const resp = await axios.post(
                `${domain}chat.postMessage`,
                {
                    roomId: roomId || '@dungnguyen.nvd',
                    text: text || '',
                },
                config,
            )
            console.log(resp.data)
        } catch (err) {
            // Handle Error Here
            console.error(err)
        }
    },
}

export const API_MANAGE = {
    // getAllRoom: async (types: string[], text: string, current: number, itemsPerPage: number ): Promise<any> => {
    getAllRoom: async ({ types, text, current, itemsPerPage }: { types: string[]; text: string; current: number; itemsPerPage: number }): Promise<any> => {
        try {
            const resp = await axios.get(`${domain}rooms.adminRooms`, {
                params: {
                    types: types,
                    filter: text,
                    current,
                    itemsPerPage,
                },
                headers: config.headers,
            })
            return {
                data: resp.data.rooms,
                success: resp.data.success,
                number: resp.data.total,
            }
        } catch (err) {
            // Handle Error Here
            console.error(err)
        }
    },
    getRoomInfoById: async ({ rid }: { rid: string | undefined }): Promise<any> => {
        try {
            const resp = await axios.get(`${domain}rooms.adminRooms.getRoom`, {
                params: {
                    rid,
                },
                headers: config.headers,
            })
            return {
                data: resp.data.data,
                success: resp.data.success,
            }
        } catch (err) {
            // Handle Error Here
            console.error(err)
        }
    },
    updateRoomInfo: async (body: API.UpdateRoomInfo, options?: { [key: string]: any }) => {
        return request<API.CommonResponse>(`${domain}users.update`, {
            method: 'POST',
            headers: config.headers,
            data: body,
            ...(options || {}),
        })
    },
    updateUserInfo: async (body: API.UpdateUserInfo, options?: { [key: string]: any }) => {
        return request<API.CommonResponse>(`${domain}users.update`, {
            method: 'POST',
            headers: config.headers,
            data: body,
            ...(options || {}),
        })
    },
    resetAvatarToDefault: async (body: { userId: string }, options?: { [key: string]: any }) => {
        return request<API.CommonResponse>(`${domain}users.resetAvatar`, {
            method: 'POST',
            headers: config.headers,
            data: body,
            ...(options || {}),
        })
    },
}
