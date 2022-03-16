// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { TableListItem } from '../../pages/list/table-list/data.d';

/** Get rule list GET /api/rule */
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
    data: TableListItem[];
    /** Total number of contents */
    total?: number;
    success?: boolean;
  }>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** New rules PUT /api/rule */
export async function updateRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<TableListItem>('/api/rule', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

/** New rules POST /api/rule */
export async function addRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<TableListItem>('/api/rule', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

/** Delete rule DELETE /api/rule */
export async function removeRule(data: { key: number[] }, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}
