import component from './vi-VN/component'
import globalHeader from './vi-VN/globalHeader'
import menu from './vi-VN/menu'
import pwa from './vi-VN/pwa'
import settingDrawer from './vi-VN/settingDrawer'
import settings from './vi-VN/settings'
import pages from './vi-VN/pages'

export default {
    'navBar.lang': 'language',
    'layout.user.link.help': 'help',
    'layout.user.link.privacy': 'privacy',
    'layout.user.link.terms': 'Clause',
    'app.copyright.produced': 'Ant Group Experience Technical Department',
    'app.preview.down.block': 'Download this page to your local project',
    'app.welcome.link.fetch-blocks': 'Get all blocks',
    'app.welcome.link.block-list': 'Based on Block development, fast build standard page',
    ...pages,
    ...globalHeader,
    ...menu,
    ...settingDrawer,
    ...settings,
    ...pwa,
    ...component,
}
