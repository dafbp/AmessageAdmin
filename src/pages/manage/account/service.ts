// @ts-ignore
/* eslint-disable */
import { domain, config } from '@/services/api/axios'
import { request } from 'umi'
import { TableListAccountItem } from './data'

/** New rules PUT /api/manage/account */
export async function updateRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
    return request<TableListAccountItem>('/api/manage/account', {
        data,
        method: 'PUT',
        ...(options || {}),
    })
}

/** New rules POST /api/manage/account */
export async function addRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
    return request<TableListAccountItem>('/api/manage/account', {
        data,
        method: 'POST',
        ...(options || {}),
    })
}

/** Delete rule DELETE /api/manage/account */
export async function removeRule(data: { key: number[] }, options?: { [key: string]: any }) {
    return request<Record<string, any>>('/api/manage/account', {
        data,
        method: 'DELETE',
        ...(options || {}),
    })
}

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
