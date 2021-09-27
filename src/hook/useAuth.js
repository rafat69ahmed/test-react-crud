import { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import UserContext from 'context/userContext'
import { setAuthCookie, removeAuthCookie } from 'util/cookie'
import { notification } from 'antd'
import axios from 'axios'

export default function useAuth() {
    const history = useHistory()
    const { setUser } = useContext(UserContext)
    const [error, setError] = useState(null)

    const setUserContext = (param) => {
        setUser(param)
        history.push('/pending-trainer-list')
    }
    // login user
    const loginUser = async (credential) => {
        try {
            const { username, secret } = credential
            const { data } = await axios.post(
                'https://us-central1-thefeelgoodfactory-c0649.cloudfunctions.net/accessToken',
                {
                    username,
                    secret
                }
            )
            //! This is a fallback, in case the response is 200, but token or user is not attached with the response
            if (!data.access_token || !data.name) {
                return notification.error({
                    message: 'Internal Server error',
                    description: 'Token is not found in the response'
                })
            }
            // Setting token to cookie
            setAuthCookie(data.access_token)
            // Setting user to context
            setUserContext(data.name)
        } catch (err) {
            console.log(err?.response)
            setError(err?.response)
        }
    }
    // logout user
    const logoutUser = () => {
        removeAuthCookie()
        setUser(null)
        return history.push('/login')
    }

    return {
        loginUser,
        logoutUser,
        error
    }
}
