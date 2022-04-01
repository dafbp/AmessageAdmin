import { domain, config } from '@/services/api/axios'
import { request } from 'umi'

export async function getListUserBroker(
    params: {
        role?: string
        roomId?: string
    },
    options?: { [key: string]: any },
) {
    const result = request<{
        users: any[]
        /** Total number of contents */
        total?: number
        success?: boolean
    }>(`${domain}roles.getUsersInRole`, {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
        ...config,
    })
    return result
}

export async function searchUser(
    params: {
        query: string
    },
    options?: { [key: string]: any },
) {
    const result = request<{
        users: any[]
        room: any[]
        /** Total number of contents */
        total?: number
        success?: boolean
    }>(`${domain}spotlight`, {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
        ...config,
    })
    console.log('result', result)
    return result
}

export async function getListRoles(params?: {}, options?: { [key: string]: any }) {
    const result = request<{
        total?: number
        success?: boolean
        roles: []
    }>(`${domain}roles.list`, {
        method: 'GET',
        params: {
            ...params,
        },
        ...(options || {}),
        ...config,
    })
    return result
}
