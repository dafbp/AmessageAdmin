declare namespace API {
    type CommonResponse = {
        data: any
    }
    type UpdateUserInfo = {
        userId: string
        data: {
            nickname: string
        }
    }
    type UpdateRoomInfo = {
        rid: string
        roomName: string
        roomTopic: string
        roomType: string
        readOnly: boolean
        default: boolean
        favorite: {
            defaultValue: boolean
            favorite: boolean
        }
        featured: boolean
        roomDescription: string
        roomAnnouncement: string
    }
    interface ICurrentUserInfo {
        _id: string
        createdAt: string
        services: Services
        emails: Email2[]
        type: string
        status: string
        active: boolean
        roles: string[]
        name: string
        lastLogin: string
        statusConnection: string
        utcOffset: number
        username: string
        statusText: string
        requirePasswordChange: boolean
        customFields: CustomFields
        avatarETag: string
        nickname: string
        canViewAllInfo: boolean
    }

    interface CustomFields {
        phone: string
        account_name: string
        account_no: string
        account_type_trading: string
        broker: string
        email: string
    }

    interface Email2 {
        address: string
        verified: boolean
    }

    interface Services {
        password: Password
        email: Email
        resume: Resume
        cloud: Cloud
        passwordHistory: string[]
    }

    interface Cloud {
        accessToken: string
        expiresAt: string
        scope: string
        tokenType: string
        refreshToken: string
    }

    interface Resume {
        loginTokens: LoginToken[]
    }

    interface LoginToken {
        hashedToken: string
        type?: string
        createdAt?: string
        lastTokenPart?: string
        name?: string
        bypassTwoFactor?: boolean
        when?: string
    }

    interface Email {
        verificationTokens: any[]
    }

    interface Password {
        bcrypt: string
    }

    /**
     *   -------------------------- Của Antd
     */
    type CurrentUser = {
        name?: string
        avatar?: string
        userid?: string
        email?: string
        signature?: string
        title?: string
        group?: string
        tags?: { key?: string; label?: string }[]
        notifyCount?: number
        unreadCount?: number
        country?: string
        access?: string
        geographic?: {
            province?: { label?: string; key?: string }
            city?: { label?: string; key?: string }
        }
        address?: string
        phone?: string
    }

    type LoginResult = {
        status?: string
        type?: string
        currentAuthority?: string
    }

    type PageParams = {
        current?: number
        pageSize?: number
    }

    type RuleListItem = {
        key?: number
        disabled?: boolean
        href?: string
        avatar?: string
        name?: string
        owner?: string
        desc?: string
        callNo?: number
        status?: number
        updatedAt?: string
        createdAt?: string
        progress?: number
    }

    type RuleList = {
        data?: RuleListItem[]
        /** 列表的内容总数 */
        total?: number
        success?: boolean
    }

    type FakeCaptcha = {
        code?: number
        status?: string
    }

    type LoginParams = {
        username?: string
        password?: string
        autoLogin?: boolean
        type?: string
    }

    type ErrorResponse = {
        /** 业务约定的错误码 */
        errorCode: string
        /** 业务上的错误信息 */
        errorMessage?: string
        /** 业务上的请求是否成功 */
        success?: boolean
    }

    type NoticeIconList = {
        data?: NoticeIconItem[]
        /** 列表的内容总数 */
        total?: number
        success?: boolean
    }

    type NoticeIconItemType = 'notification' | 'message' | 'event'

    type NoticeIconItem = {
        id?: string
        extra?: string
        key?: string
        read?: boolean
        avatar?: string
        title?: string
        status?: string
        datetime?: string
        description?: string
        type?: NoticeIconItemType
    }
}
