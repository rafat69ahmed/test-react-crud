import { useState, useEffect } from 'react'
import { getAuthCookie } from 'util/cookie'
import useHttp from './useHttp'

const useFindUser = () => {
    const { http } = useHttp()
    const [user, setUser] = useState(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        async function findUser() {
            // First check if the token exist in cookie ! If not, then there is no point to request for user data
            const token = getAuthCookie()
            if (!token) {
                setUser(null)
                return setLoading(false)
            }
            // TODO: Change if possible to a user endpoint
            http.get(
                'https://firestore.googleapis.com/v1/projects/thefeelgoodfactory-c0649/databases/(default)/documents/trainer_calendar/all_bookings/07-2021'
            )
                .then(() => {
                    setUser({
                        name: 'Admin'
                    })
                    setLoading(false)
                })
                .catch(() => {
                    setLoading(false)
                })
        }
        findUser()
    }, [])

    return {
        user,
        setUser,
        isLoading
    }
}
export default useFindUser
