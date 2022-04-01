import { useIntl } from 'umi'
import { GithubOutlined } from '@ant-design/icons'
import { DefaultFooter } from '@ant-design/pro-layout'

export default () => {
    const intl = useIntl()
    const defaultMessage = intl.formatMessage({
        id: 'app.copyright.produced',
        defaultMessage: 'Altisss High Technology',
    })

    const currentYear = new Date().getFullYear()

    return (
        <DefaultFooter
            copyright={`${currentYear} ${defaultMessage}`}
            links={[
                {
                    key: 'Altisss Hi-Tech',
                    title: 'Altisss Hi-Tech',
                    href: 'https://altisss.vn',
                    blankTarget: true,
                },
            ]}
        />
    )
}
