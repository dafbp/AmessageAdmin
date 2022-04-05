type KeyLocalStorage = {
    key: 'loginToken' | 'userId' | 'loginTokenExpires' | 'userInfo'
    data?: { [x: string]: any }
}

export const saveDataToLocalStorage = async ({ key, data }: KeyLocalStorage): Promise<boolean> => {
    let success = true
    try {
        localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
        success = false
    }
    return success
}
export const getDataFromLocalStorage = async ({ key }: KeyLocalStorage): Promise<any> => {
    try {
        const data = localStorage.getItem(key) || ''
        return JSON.parse(data)
    } catch (error) {
        console.log('error_parse_json getDataFromLocalStorage', key)
        return null
    }
}
export const clearDataFromLocalStorage = async ({ key }: KeyLocalStorage): Promise<any> => {
    try {
        localStorage.removeItem(key)
    } catch (error) {
        console.log('error clearDataFromLocalStorage')
        return error
    }
}
