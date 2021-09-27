import { createContext } from 'react'

const UserContext = createContext({
    setUser: null,
    user: null,
    isLoading: false
})

export default UserContext
