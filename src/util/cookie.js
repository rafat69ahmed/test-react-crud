import Cookies from 'js-cookie'

export const ACCESS_TOKEN_NAME = 'tfgf_access_token'

export const getAuthCookie = () => Cookies.get(ACCESS_TOKEN_NAME)
export const setAuthCookie = (token) => {
    Cookies.set(ACCESS_TOKEN_NAME, token)
}
export const removeAuthCookie = () => Cookies.remove(ACCESS_TOKEN_NAME)
