import { Settings as LayoutSettings } from '@ant-design/pro-layout'

const Settings: LayoutSettings & {
    pwa?: boolean
    logo?: string
} = {
    navTheme: 'light',
    // Dawn
    primaryColor: '#60B44A',
    layout: 'mix',
    contentWidth: 'Fluid',
    fixedHeader: false,
    fixSiderbar: true,
    colorWeak: false,
    title: 'A-Message Admin',
    pwa: false,
    logo: 'https://altisss.vn/static/img/logo.png',
    iconfontUrl: '',
}

export default Settings
