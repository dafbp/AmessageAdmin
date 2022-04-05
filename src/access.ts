/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.ICurrentUserInfo | undefined }) {
    const { currentUser } = initialState || {}
    // ---------
    const adminRouteFilter = () => currentUser?.roles?.includes('admin')
    const brokerRouteFilter = () => currentUser?.roles?.includes('brokertest')
    const devRouteFilter = () => adminRouteFilter() && process.env.NODE_ENV === 'development'

    // ---------
    return {
        devRouteFilter,
        adminRouteFilter,
        brokerRouteFilter,
        canAdmin: currentUser && currentUser.roles.includes('admin'),
        // isBroker: currentUser && currentUser.roles.includes('brokertest'),
    }
}
