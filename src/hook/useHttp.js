/* eslint-disable func-names */
import React from 'react'
import axios from 'axios'
import { message } from 'antd'
import { getAuthCookie, ACCESS_TOKEN_NAME } from 'util/cookie'
import Cookies from 'js-cookie'

const defaultParam = {
    auth: true
}

const useHttp = (param = defaultParam) =>
    React.useMemo(() => {
        const headers = {
            'Content-Type': 'application/json'
        }
        // TODO: Fetch token from cookie or other medium
        const token = getAuthCookie()

        if (param.auth && token) {
            headers.Authorization = `Bearer ${token}`
        }

        const http = axios.create({
            headers
        })

        http.interceptors.request.use(
            function (config) {
                return config
            },
            function (error) {
                return Promise.reject(error)
            }
        )

        http.interceptors.response.use(
            function (response) {
                return response
            },
            function (error) {
                // !debug, remove later
                console.log(error.response)
                if (error?.response?.status === 403) {
                    Cookies.remove(ACCESS_TOKEN_NAME)
                    return Promise.reject(error)
                }
                message.error('Something went wrong')
                return Promise.reject(error)
            }
        )
        return { http }
    }, [param.auth])

export default useHttp
