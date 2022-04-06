import component from './vi-VN/component'
import globalHeader from './vi-VN/globalHeader'
import menu from './vi-VN/menu'
import pwa from './vi-VN/pwa'
import settingDrawer from './vi-VN/settingDrawer'
import settings from './vi-VN/settings'
import pages from './vi-VN/pages'

export default {
    'navBar.lang': 'ngôn ngữ',
    'layout.user.link.help': 'help',
    'layout.user.link.privacy': 'quyền riêng tư',
    'layout.user.link.terms': 'Điều khoản',
    'app.copyright.produced': 'Bản quyền thuộc về ...',
    'app.preview.down.block': 'Tải trang này xuống dự án cục bộ của bạn',
    'app.welcome.link.fetch-blocks': 'Nhận tất cả các khối',
    'app.welcome.link.block-list': 'Dựa trên phát triển Block, trang tiêu chuẩn xây dựng nhanh',
    ...pages,
    ...globalHeader,
    ...menu,
    ...settingDrawer,
    ...settings,
    ...pwa,
    ...component,
}
