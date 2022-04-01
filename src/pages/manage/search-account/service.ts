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
export async function searchUserAdvanced(
    params: {
        isSearchPhone?: boolean
        isSearchName?: boolean
        isSearchBroker?: boolean
        isSearchAccountTrading?: boolean
        isSearchEmail?: boolean
        searchString?: string
    },
    options?: { [key: string]: any },
) {
    const query = []
    const sort = {}
    if (params.isSearchPhone) {
        query.push({ 'customFields.phone': { $regex: params.searchString, $options: 'i' } })
        sort['customFields.phone'] = 1
    }
    if (params.isSearchName) {
        query.push({ username: { $regex: params.searchString, $options: 'i' } })
        query.push({ name: { $regex: params.searchString, $options: 'i' } })
        sort['username'] = 1
        sort['name'] = 1
    }
    if (params.isSearchBroker) {
        query.push({ 'customFields.broker': { $regex: params.searchString, $options: 'i' } })
        sort['customFields.broker'] = 1
    }
    if (params.isSearchAccountTrading) {
        query.push({ 'customFields.account_no': { $regex: params.searchString, $options: 'i' } })
        sort['customFields.account_no'] = 1
    }
    if (params.isSearchEmail) {
        query.push({ 'emails.address': { $regex: params.searchString, $options: 'i' } })
        sort['emails.address'] = 1
    }

    const result = request<{
        users: any[]
        total?: number
        success?: boolean
    }>(`${domain}users.list`, {
        method: 'GET',
        params: {
            fields: { name: 1, username: 1, emails: 1, roles: 1, status: 1, avatarETag: 1, active: 1, customFields: 1 },
            query: { $or: query },
            sort: sort,
            count: 50,
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
