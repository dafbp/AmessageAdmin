import Footer from '@/components/Footer'
import { saveDataToLocalStorage } from '@/localData'
import { login, USER_API } from '@/services/ant-design-pro/api'
import { getFakeCaptcha } from '@/services/ant-design-pro/login'
// import { updateTokenRequestHeaders } from '@/services/api/axios';
import { LockOutlined, MobileOutlined, UserOutlined } from '@ant-design/icons'
import { LoginForm, ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form'
import { Alert, message, Tabs } from 'antd'
import React, { useState } from 'react'
import { FormattedMessage, history, SelectLang, useIntl, useModel } from 'umi'
import styles from './index.less'

const LoginMessage: React.FC<{
    content: string
}> = ({ content }) => (
    <Alert
        style={{
            marginBottom: 24,
        }}
        message={content}
        type='error'
        showIcon
    />
)

const Login: React.FC = () => {
    const [userLoginState, setUserLoginState] = useState<API.LoginResult>({})
    const [type, setType] = useState<string>('account')
    const { initialState, setInitialState } = useModel('@@initialState')

    const intl = useIntl()

    const fetchUserInfo = async (userId: string, headersOptions: any) => {
        const userInfo = await initialState?.fetchUserInfo?.(userId, headersOptions)
        if (userInfo) {
            await setInitialState((s) => ({
                ...s,
                currentUser: userInfo,
            }))
        }
    }

    const { status, type: loginType } = userLoginState

    const handleLoginRocketChat = async (values: any) => {
        const { data, success, error } = await USER_API.login({
            user: values.username,
            password: values.password,
        })
        if (success) {
            const defaultLoginSuccessMessage = intl.formatMessage({
                id: 'pages.login.success',
                defaultMessage: 'login successful!',
            })
            message.success(defaultLoginSuccessMessage)
            const headersOptions = {
                headers: {
                    'X-Auth-Token': data?.data?.authToken,
                    'X-User-Id': data?.data?.userId,
                    'X-Requested-With': 'XMLHttpRequest',
                    Accept: '*/*',
                },
            }
            // await updateTokenRequestHeaders()
            await fetchUserInfo(data?.data?.userId, headersOptions)
            // ----- setDataLocal
            saveDataToLocalStorage({ key: 'userInfo', data: data?.data })
            saveDataToLocalStorage({ key: 'userId', data: data?.data?.userId })
            saveDataToLocalStorage({ key: 'loginToken', data: data?.data?.authToken })
            /** This method will jump to redirect Parameter location */
            if (!history) return
            const { query } = history.location
            const { redirect } = query as { redirect: string }
            history.push(redirect || '/')
            window.location.reload() // Reload lần đầu để lấy đúng token trong local storage
        }
        if (!success) {
            const defaultLoginFailureMessage = intl.formatMessage({
                id: 'pages.login.failure',
                defaultMessage: 'Login failed, please try again!',
            })
            message.error(defaultLoginFailureMessage)
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.lang} data-lang>
                {SelectLang && <SelectLang />}
            </div>
            <div className={styles.content}>
                <LoginForm
                    logo={<img alt='logo' src='/logo.svg' />}
                    title='A-Messages Admin'
                    subTitle={intl.formatMessage({ id: 'pages.layouts.userLayout.title' })}
                    initialValues={{
                        autoLogin: true,
                    }}
                    actions={
                        [
                            // <FormattedMessage
                            //   key="loginWith"
                            //   id="pages.login.loginWith"
                            //   defaultMessage="Other login mode"
                            // />,
                            // <AlipayCircleOutlined key="AlipayCircleOutlined" className={styles.icon} />,
                            // <TaobaoCircleOutlined key="TaobaoCircleOutlined" className={styles.icon} />,
                            // <WeiboCircleOutlined key="WeiboCircleOutlined" className={styles.icon} />,
                        ]
                    }
                    onFinish={async (values) => {
                        console.log('values', values)

                        // await handleSubmit(values as API.LoginParams);
                        await handleLoginRocketChat(values)
                    }}
                >
                    {/* <Tabs activeKey={type} onChange={setType}>
                        <Tabs.TabPane
                            key='account'
                            tab={intl.formatMessage({
                                id: 'pages.login.accountLogin.tab',
                                defaultMessage: 'Account password login',
                            })}
                        />
                        <Tabs.TabPane
                            key='mobile'
                            tab={intl.formatMessage({
                                id: 'pages.login.phoneLogin.tab',
                                defaultMessage: 'Mobile phone number login',
                            })}
                        />
                    </Tabs> */}

                    {status === 'error' && loginType === 'account' && (
                        <LoginMessage
                            content={intl.formatMessage({
                                id: 'pages.login.accountLogin.errorMessage',
                                defaultMessage: 'Account or password error(admin/ant.design)',
                            })}
                        />
                    )}
                    {type === 'account' && (
                        <>
                            <ProFormText
                                name='username'
                                fieldProps={{
                                    size: 'large',
                                    prefix: <UserOutlined className={styles.prefixIcon} />,
                                }}
                                placeholder={intl.formatMessage({
                                    id: 'pages.login.username.placeholder',
                                    defaultMessage: 'username: admin or user',
                                })}
                                rules={[
                                    {
                                        required: true,
                                        message: <FormattedMessage id='pages.login.username.required' defaultMessage='please enter user name!' />,
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                name='password'
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className={styles.prefixIcon} />,
                                }}
                                placeholder={intl.formatMessage({
                                    id: 'pages.login.password.placeholder',
                                    defaultMessage: 'password: ant.design',
                                })}
                                rules={[
                                    {
                                        required: true,
                                        message: <FormattedMessage id='pages.login.password.required' defaultMessage='Please enter your password!' />,
                                    },
                                ]}
                            />
                        </>
                    )}

                    {status === 'error' && loginType === 'mobile' && <LoginMessage content='Verification code error' />}
                    {type === 'mobile' && (
                        <>
                            <ProFormText
                                fieldProps={{
                                    size: 'large',
                                    prefix: <MobileOutlined className={styles.prefixIcon} />,
                                }}
                                name='mobile'
                                placeholder={intl.formatMessage({
                                    id: 'pages.login.phoneNumber.placeholder',
                                    defaultMessage: 'Phone number',
                                })}
                                rules={[
                                    {
                                        required: true,
                                        message: <FormattedMessage id='pages.login.phoneNumber.required' defaultMessage='Please enter phone number!' />,
                                    },
                                    {
                                        pattern: /^1\d{10}$/,
                                        message: <FormattedMessage id='pages.login.phoneNumber.invalid' defaultMessage='Malformed phone number!' />,
                                    },
                                ]}
                            />
                            <ProFormCaptcha
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className={styles.prefixIcon} />,
                                }}
                                captchaProps={{
                                    size: 'large',
                                }}
                                placeholder={intl.formatMessage({
                                    id: 'pages.login.captcha.placeholder',
                                    defaultMessage: 'please enter verification code',
                                })}
                                captchaTextRender={(timing, count) => {
                                    if (timing) {
                                        return `${count} ${intl.formatMessage({
                                            id: 'pages.getCaptchaSecondText',
                                            defaultMessage: 'get verification code',
                                        })}`
                                    }
                                    return intl.formatMessage({
                                        id: 'pages.login.phoneLogin.getVerificationCode',
                                        defaultMessage: 'get verification code',
                                    })
                                }}
                                name='captcha'
                                rules={[
                                    {
                                        required: true,
                                        message: <FormattedMessage id='pages.login.captcha.required' defaultMessage='please enter verification code!' />,
                                    },
                                ]}
                                onGetCaptcha={async (phone) => {
                                    const result = await getFakeCaptcha({
                                        phone,
                                    })
                                    if (result === false) {
                                        return
                                    }
                                    message.success('Get the verification code successfully!Verification code is: 1234')
                                }}
                            />
                        </>
                    )}
                    <div
                        style={{
                            marginBottom: 24,
                        }}
                    >
                        <ProFormCheckbox noStyle name='autoLogin'>
                            <FormattedMessage id='pages.login.rememberMe' defaultMessage='automatic log-in' />
                        </ProFormCheckbox>
                        <a
                            style={{
                                float: 'right',
                            }}
                        >
                            <FormattedMessage id='pages.login.forgotPassword' defaultMessage='Forgot password' />
                        </a>
                    </div>
                </LoginForm>
            </div>
            <Footer />
        </div>
    )
}

export default Login

interface ILoginResult {
    userId: string
    authToken: string
    me: Me
}

interface Me {
    _id: string
    services: Services
    emails: Email[]
    status: string
    active: boolean
    _updatedAt: string
    roles: string[]
    name: string
    statusConnection: string
    utcOffset: number
    username: string
    settings: Settings
    statusText: string
    statusDefault: string
    banners: Banners
    language: string
    requirePasswordChange: boolean
    statusLivechat: string
    customFields: CustomFields
    avatarETag: string
    avatarOrigin: string
    nickname: string
    email: string
    avatarUrl: string
}

interface CustomFields {
    brokerId: string
    phone: string
}

interface Banners {
    'versionUpdate-4_1_2': VersionUpdate412
    'versionUpdate-4_2_0': VersionUpdate412
    'versionUpdate-4_2_1': VersionUpdate412
    mongodbDeprecation_4_0_27: MongodbDeprecation4027
    'versionUpdate-4_2_2': VersionUpdate412
    'alert-61baeab0907d6ac39efa4cb3': Alert61baeab0907d6ac39efa4cb3
    'versionUpdate-4_3_0': VersionUpdate412
    'versionUpdate-4_3_1': VersionUpdate412
    'versionUpdate-4_3_2': VersionUpdate412
    'versionUpdate-4_4_0': VersionUpdate412
    'versionUpdate-4_4_1': VersionUpdate412
    'versionUpdate-4_4_2': VersionUpdate412
    'versionUpdate-4_5_0': VersionUpdate412
    'versionUpdate-4_5_1': VersionUpdate412
    'versionUpdate-4_5_2': VersionUpdate412
    'versionUpdate-4_5_3': VersionUpdate412
    'versionUpdate-4_5_4': VersionUpdate412
}

interface Alert61baeab0907d6ac39efa4cb3 {
    id: string
    priority: number
    title: string
    text: string
    textArguments: any[]
    modifiers: any[]
    link: string
    read: boolean
}

interface MongodbDeprecation4027 {
    id: string
    priority: number
    title: string
    text: string
    textArguments: string[]
    modifiers: string[]
    link: string
    read: boolean
}

interface VersionUpdate412 {
    id: string
    priority: number
    title: string
    text: string
    textArguments: string[]
    link: string
    read: boolean
}

interface Settings {
    preferences: Preferences
}

interface Preferences {
    enableAutoAway: boolean
    idleTimeLimit: number
    desktopNotificationRequireInteraction: boolean
    desktopNotifications: string
    unreadAlert: boolean
    useEmojis: boolean
    convertAsciiEmoji: boolean
    autoImageLoad: boolean
    saveMobileBandwidth: boolean
    hideUsernames: boolean
    hideRoles: boolean
    hideFlexTab: boolean
    displayAvatars: boolean
    sidebarGroupByType: boolean
    sidebarViewMode: string
    sidebarDisplayAvatar: boolean
    sidebarShowUnread: boolean
    sidebarSortby: string
    sidebarShowFavorites: boolean
    sendOnEnter: string
    messageViewMode: number
    emailNotificationMode: string
    newRoomNotification: string
    newMessageNotification: string
    enableMessageParserEarlyAdoption: boolean
    pushNotifications: string
    collapseMediaByDefault: boolean
    showMessageInMainThread: boolean
    muteFocusedConversations: boolean
    notificationsSoundVolume: number
    language: string
    dontAskAgainList: DontAskAgainList[]
}

interface DontAskAgainList {
    action: string
    label: string
}

interface Email {
    address: string
    verified: boolean
}

interface Services {
    password: Password
}

interface Password {
    bcrypt: string
}
