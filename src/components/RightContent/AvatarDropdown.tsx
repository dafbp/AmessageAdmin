import React, { useCallback } from 'react'
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Menu, Spin } from 'antd'
import { history, useModel } from 'umi'
import { stringify } from 'querystring'
import HeaderDropdown from '../HeaderDropdown'
import styles from './index.less'
import { outLogin } from '@/services/ant-design-pro/api'
import type { MenuInfo } from 'rc-menu/lib/interface'
import { clearDataFromLocalStorage } from '@/localData'

export type GlobalHeaderRightProps = {
    menu?: boolean
}

/**
 * Exit login and save the current URL
 */
const loginOut = async () => {
    await outLogin()
    const { query = {}, pathname } = history.location
    const { redirect } = query
    // Clear data before login
    clearDataFromLocalStorage({ key: 'userId' })
    clearDataFromLocalStorage({ key: 'loginToken' })
    clearDataFromLocalStorage({ key: 'userInfo' })
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
            pathname: '/user/login',
            search: stringify({
                redirect: pathname,
            }),
        })
        window.location.reload()
    }
}

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
    const { initialState, setInitialState } = useModel('@@initialState')

    const onMenuClick = useCallback(
        (event: MenuInfo) => {
            const { key } = event
            if (key === 'logout') {
                setInitialState((s) => ({ ...s, currentUser: undefined }))
                loginOut()
                return
            }
            history.push(`/account/${key}`)
        },
        [setInitialState],
    )

    const loading = (
        <span className={`${styles.action} ${styles.account}`}>
            <Spin
                size='small'
                style={{
                    marginLeft: 8,
                    marginRight: 8,
                }}
            />
        </span>
    )

    if (!initialState) {
        return loading
    }

    const { currentUser } = initialState

    if (!currentUser || !currentUser?.name) {
        return loading
    }

    const menuHeaderDropdown = (
        <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
            {menu && (
                <Menu.Item key='center'>
                    <UserOutlined />
                    Personal center
                </Menu.Item>
            )}
            {menu && (
                <Menu.Item key='settings'>
                    <SettingOutlined />
                    Personal settings
                </Menu.Item>
            )}
            {menu && <Menu.Divider />}

            <Menu.Item key='logout'>
                <LogoutOutlined />
                Sign out
            </Menu.Item>
        </Menu>
    )
    return (
        <HeaderDropdown overlay={menuHeaderDropdown}>
            <span className={`${styles.action} ${styles.account}`}>
                <Avatar size='small' className={styles.avatar} src={`https://chat.altisss.vn/avatar/${currentUser?.username}`} alt='avatar' />
                <span className={`${styles.name} anticon`}>{currentUser?.name}</span>
            </span>
        </HeaderDropdown>
    )
}

export default AvatarDropdown
