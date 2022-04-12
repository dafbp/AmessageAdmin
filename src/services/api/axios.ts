import axios from 'axios'
import { request } from 'umi'
import { getDataFromLocalStorage } from '@/localData'

export const domain = 'https://chat.altisss.vn/api/v1/'
export const host = 'https://chat.altisss.vn/api/v1/'

export const getConfigAsync = async () => {
    const X_User_Id = await getDataFromLocalStorage({ key: 'userId' })
    const X_Auth_Token = await getDataFromLocalStorage({ key: 'loginToken' })
    return {
        headers: {
            'X-Auth-Token': X_Auth_Token,
            'X-User-Id': X_User_Id,
            'X-Requested-With': 'XMLHttpRequest',
            Accept: '*/*',
        },
    }
}

export const config = await getConfigAsync()

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
                data: resp.data,
                success: resp.data.success,
            }
        } catch (err) {
            // Handle Error Here
            console.error(err)
        }
    },
    getUserInfoById: async ({ userId }: { userId: string | undefined }): Promise<any> => {
        try {
            const resp = await axios.get(`${domain}users.info`, {
                params: {
                    userId,
                },
                headers: config.headers,
            })
            return {
                data: resp.data.user,
                success: resp.data.success,
            }
        } catch (err) {
            // Handle Error Here
            console.error(err)
        }
    },
    updateRoomInfo: async (body: API.UpdateRoomInfo, options?: { [key: string]: any }) => {
        return request<API.CommonResponse>(`${domain}rooms.saveRoomSettings`, {
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
    confirmDeleteRoom: async (body: { roomId?: string; roomName?: string }, options?: { [key: string]: any }) => {
        return request<API.CommonResponse>(`${domain}groups.delete`, {
            method: 'POST',
            headers: config.headers,
            data: body,
            ...(options || {}),
        })
    },
}
