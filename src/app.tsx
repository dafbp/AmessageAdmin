import type { Settings as LayoutSettings } from '@ant-design/pro-layout'
import { PageLoading } from '@ant-design/pro-layout'
import type { RunTimeLayoutConfig } from 'umi'
import { history, Link } from 'umi'
import RightContent from '@/components/RightContent'
import Footer from '@/components/Footer'
import { currentUser as queryCurrentUser, USER_API } from './services/ant-design-pro/api'
import { BookOutlined, LinkOutlined } from '@ant-design/icons'
import { getDataFromLocalStorage } from './localData'
import { getConfigAsync } from './services/api/axios'

const isDev = process.env.NODE_ENV === 'development'
const loginPath = '/user/login'

/** When you get user information, you will show a time. loading */
export const initialStateConfig = {
    loading: <PageLoading />,
}

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */

export async function getInitialState(): Promise<{
    settings?: Partial<LayoutSettings>
    currentUser?: API.ICurrentUserInfo
    fetchUserInfo?: (userId: string, headersOptions?: any) => Promise<API.ICurrentUserInfo | undefined>
}> {
    const userId = await getDataFromLocalStorage({ key: 'userId' })
    const fetchUserInfo = async (_uid: string, headersOptions?: any) => {
        try {
            const msg = await USER_API.userInfo({ userId: _uid }, headersOptions)
            return msg.data
        } catch (error) {
            history.push(loginPath)
        }
        return undefined
    }
    // If it is a login page, do not execute
    if (history.location.pathname !== loginPath) {
        const currentUser = await fetchUserInfo(userId)
        return {
            fetchUserInfo,
            currentUser,
            settings: {},
        }
    }
    return {
        fetchUserInfo,
        settings: {},
    }
}

// ProLayout Supported API https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
    return {
        rightContentRender: () => <RightContent />,
        disableContentMargin: false,
        waterMarkProps: {
            // content: initialState?.currentUser?.name,
            content: null,
        },
        footerRender: () => <Footer />,
        onPageChange: () => {
            const { location } = history
            // If you don't log in, redirect to login
            if (!initialState?.currentUser && location.pathname !== loginPath) {
                history.push(loginPath)
            }
        },
        links: isDev
            ? [
                  <Link to='/umi/plugin/openapi' target='_blank' key='link-1'>
                      <LinkOutlined />
                      <span>OpenAPI </span>
                  </Link>,
                  <Link to='/~docs' key='link-2'>
                      <BookOutlined />
                      <span>Docs</span>
                  </Link>,
              ]
            : [],
        menuHeaderRender: undefined,
        // Custom 403 Page
        // unAccessible: <div>unAccessible</div>,
        ...initialState?.settings,
    }
}

type RequestConfig = any
const errorHandler = function (error: any) {
    const codeMap = {
        '021': 'An error has occurred',
        '022': 'It’s a big mistake,',
        // ....
    }
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.status)
        console.log(error.response.headers)
        console.log(error.data)
        console.log(error.request)
        console.log(codeMap[error.data.status])
    } else {
        // The request was made but no response was received or error occurs when setting up the request.
        console.log(error.message)
    }

    throw error // If throw. The error will continue to be thrown.
}
const headersMiddleware = async (ctx, next) => {
    console.log('headersMiddleware a1', ctx)
    await next()
    console.log('headersMiddleware a2')
}

export const request: RequestConfig = {
    errorHandler,
    middlewares: [headersMiddleware],
}
