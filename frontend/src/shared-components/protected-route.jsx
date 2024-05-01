import { useRecoilState } from "recoil"

import { Navigate, Outlet } from "react-router-dom"
import { userAtom } from "../store/atoms/todo"

function ProtectedRoute() {
    const [user, setUser] = useRecoilState(userAtom)

    return (
        <>
            {localStorage.getItem('access_token') ? <Outlet /> : <Navigate to='/login' />}
        </>
    )
}

export default ProtectedRoute
