/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.ICurrentUserInfo | undefined }) {
    const { currentUser } = initialState || {}
    return {
        canAdmin: currentUser && currentUser.roles.includes('admin'),
        isBroker: currentUser && currentUser.roles.includes('brokertest'),
    }
}
