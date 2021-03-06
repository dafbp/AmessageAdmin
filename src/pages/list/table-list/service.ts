// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { TableListRoomItem } from './data';

/** Get rule list GET /api/manage/account */
export async function rule(
  params: {
    // query
    /** Current page number */
    current?: number;
    /** Page capacity */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: TableListRoomItem[];
    /** Total number of contents */
    total?: number;
    success?: boolean;
  }>('/api/manage/account', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** New rules PUT /api/manage/account */
export async function updateRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<TableListRoomItem>('/api/manage/account', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

/** New rules POST /api/manage/account */
export async function addRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<TableListRoomItem>('/api/manage/account', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

/** Delete rule DELETE /api/manage/account */
export async function removeRule(data: { key: number[] }, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/manage/account', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}
