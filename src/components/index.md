---
title: Business component
sidemenu: false
---

> This feature is [dumi] (https: inex/guide/advanced#umi-%e9%a1%b9%e7%9b%AE%E9%9B%86 %E6%88% 90% E6% A8% A1% E5% BC% 8F) is provided, DUMI is a document tool for the development scenario of the component, and it has been said to be good.

# 行业 组

Here, all of the components used in the Pro are not suitable as a component library, but it is true in business.So we prepare this document to guide you if you need this component.

## Footer footer component

This component comes with some PRO configuration, you usually need to change its information.

```tsx
/**
 * background: '#f0f2f5'
 */
import React from 'react'
import Footer from '@/components/Footer'

export default () => <Footer />
```

## HeaderDropdown head drop list

HeaderDropdown is an ANTD DropDown package, but it has increased the special processing of the mobile side, and the usage is also the same.

```tsx
/**
 * background: '#f0f2f5'
 */
import { Button, Menu } from 'antd'
import React from 'react'
import HeaderDropdown from '@/components/HeaderDropdown'

export default () => {
    const menuHeaderDropdown = (
        <Menu selectedKeys={[]}>
            <Menu.Item key='center'>Personal center</Menu.Item>
            <Menu.Item key='settings'>Personal settings</Menu.Item>
            <Menu.Divider />
            <Menu.Item key='logout'>sign out</Menu.Item>
        </Menu>
    )
    return (
        <HeaderDropdown overlay={menuHeaderDropdown}>
            <Button>hover Display menu</Button>
        </HeaderDropdown>
    )
}
```

## Headersearch Head Search Box

A input box with complementary data, supporting the backband and expand INPUT

```tsx
/**
 * background: '#f0f2f5'
 */
import { Button, Menu } from 'antd'
import React from 'react'
import HeaderSearch from '@/components/HeaderSearch'

export default () => {
    return (
        <HeaderSearch
            placeholder='Site Search'
            defaultValue='umi ui'
            options={[
                { label: 'Ant Design Pro', value: 'Ant Design Pro' },
                {
                    label: 'Ant Design',
                    value: 'Ant Design',
                },
                {
                    label: 'Pro Table',
                    value: 'Pro Table',
                },
                {
                    label: 'Pro Layout',
                    value: 'Pro Layout',
                },
            ]}
            onSearch={(value) => {
                console.log('input', value)
            }}
        />
    )
}
```

### API

| 参数            | 说明                               | 类型                         | 默认值 |
| --------------- | ---------------------------------- | ---------------------------- | ------ |
| value           | 输入框的值                         | `string`                     | -      |
| onChange        | 值修改后触发                       | `(value?: string) => void`   | -      |
| onSearch        | 查询后触发                         | `(value?: string) => void`   | -      |
| options         | 选项菜单的的列表                   | `{label,value}[]`            | -      |
| defaultVisible  | 输入框默认是否显示，只有第一次生效 | `boolean`                    | -      |
| visible         | 输入框是否显示                     | `boolean`                    | -      |
| onVisibleChange | 输入框显示隐藏的回调函数           | `(visible: boolean) => void` | -      |

## NOTICEICON notification tool

The notification tool provides an interface to display a variety of notification information.

```tsx
/**
 * background: '#f0f2f5'
 */
import { message } from 'antd'
import React from 'react'
import NoticeIcon from '@/components/NoticeIcon/NoticeIcon'

export default () => {
    const list = [
        {
            id: '000000001',
            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png',
            title: 'You received 14 new weekly reports',
            datetime: '2017-08-09',
            type: 'notification',
        },
        {
            id: '000000002',
            avatar: 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png',
            title: 'You recommend Quini has passed the third round of interview',
            datetime: '2017-08-08',
            type: 'notification',
        },
    ]
    return (
        <NoticeIcon
            count={10}
            onItemClick={(item) => {
                message.info(`${item.title} Clicked`)
            }}
            onClear={(title: string, key: string) => message.info('Click to empty more')}
            loading={false}
            clearText='Empty'
            viewMoreText='see more'
            onViewMore={() => message.info('Click to see more')}
            clearClose
        >
            <NoticeIcon.Tab tabKey='notification' count={2} list={list} title='notify' emptyText='You have viewed all notifications' showViewMore />
            <NoticeIcon.Tab tabKey='message' count={2} list={list} title='information' emptyText='You have read all messages' showViewMore />
            <NoticeIcon.Tab tabKey='event' title='Upcoming' emptyText='You have completed all to do' count={2} list={list} showViewMore />
        </NoticeIcon>
    )
}
```

### NoticeIcon API

| 参数                 | 说明                       | 类型                                                               | 默认值 |
| -------------------- | -------------------------- | ------------------------------------------------------------------ | ------ |
| count                | 有多少未读通知             | `number`                                                           | -      |
| bell                 | 铃铛的图表                 | `ReactNode`                                                        | -      |
| onClear              | 点击清空数据按钮           | `(tabName: string, tabKey: string) => void`                        | -      |
| onItemClick          | 未读消息列被点击           | `(item: API.NoticeIconData, tabProps: NoticeIconTabProps) => void` | -      |
| onViewMore           | 查看更多的按钮点击         | `(tabProps: NoticeIconTabProps, e: MouseEvent) => void`            | -      |
| onTabChange          | 通知 Tab 的切换            | `(tabTile: string) => void;`                                       | -      |
| popupVisible         | 通知显示是否展示           | `boolean`                                                          | -      |
| onPopupVisibleChange | 通知信息显示隐藏的回调函数 | `(visible: boolean) => void`                                       | -      |
| clearText            | 清空按钮的文字             | `string`                                                           | -      |
| viewMoreText         | 查看更多的按钮文字         | `string`                                                           | -      |
| clearClose           | 展示清空按钮               | `boolean`                                                          | -      |
| emptyImage           | 列表为空时的兜底展示       | `ReactNode`                                                        | -      |

### NoticeIcon.Tab API

| 参数         | 说明                          | 类型                                 | 默认值 |
| ------------ | ----------------------------- | ------------------------------------ | ------ |
| count        | How many unread notices have  | `number`                             | -      |
| title        | notify Tab title              | `ReactNode`                          | -      |
| showClear    | Display Clear button          | `boolean`                            | `true` |
| showViewMore | Show loading                  | `boolean`                            | `true` |
| tabKey       | Tab Only one key              | `string`                             | -      |
| onClick      | Children's click event        | `(item: API.NoticeIconData) => void` | -      |
| onClear      | Click on the click            | `()=>void`                           | -      |
| emptyText    | Test when it is empty         | `()=>void`                           | -      |
| viewMoreText | See more buttons text         | `string`                             | -      |
| onViewMore   | See more buttons Click        | `( e: MouseEvent) => void`           | -      |
| list         | Notification information list | `API.NoticeIconData`                 | -      |

### NoticeIconData

```tsx | pure
export interface NoticeIconData {
    id: string
    key: string
    avatar: string
    title: string
    datetime: string
    type: string
    read?: boolean
    description: string
    clickClose?: boolean
    extra: any
    status: string
}
```

## RightContent

RightContent is a combination of several components, and added Plugins' `Selectlang` plug-in.

```tsx | pure
<Space>
    <HeaderSearch
        placeholder='Site Search'
        defaultValue='umi ui'
        options={[
            { label: <a href='https://umijs.org/zh/guide/umi-ui.html'>umi ui</a>, value: 'umi ui' },
            {
                label: <a href='next.ant.design'>Ant Design</a>,
                value: 'Ant Design',
            },
            {
                label: <a href='https://protable.ant.design/'>Pro Table</a>,
                value: 'Pro Table',
            },
            {
                label: <a href='https://prolayout.ant.design/'>Pro Layout</a>,
                value: 'Pro Layout',
            },
        ]}
    />
    <Tooltip title='Use documentation'>
        <span
            className={styles.action}
            onClick={() => {
                window.location.href = 'https://pro.ant.design/docs/getting-started'
            }}
        >
            <QuestionCircleOutlined />
        </span>
    </Tooltip>
    <Avatar />
    {REACT_APP_ENV && (
        <span>
            <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
        </span>
    )}
    <SelectLang className={styles.action} />
</Space>
```
