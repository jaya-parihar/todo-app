import { useState } from 'react';
import { FaBeer } from 'react-icons/fa';

import { FaArrowRightFromBracket } from "react-icons/fa6";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Toasts from "../../shared-components/toasts";
import { useRecoilState } from 'recoil';
import { accessTokenAtom } from '../../store/atoms/todo';
import './style.css'

function Header() {

    const navigate = useNavigate()
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, showToastMessage] = useState('')
    const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom)
    const logout = () => {
        setShowToast(true)
        showToastMessage('Successfully Logged Out!')
        setAccessToken(null)
        setTimeout(() => {

            navigate('/login')
        }, 1000);
        localStorage.clear()
    }

    return (
        <span>
            {showToast ? <Toasts showToast={showToast} setShowToast={setShowToast} message={toastMessage} /> : null}
            <nav className="navbar navbar-light bg-light px-3 justify-content-between">
                <a className="navbar-brand" href="/user/list/today" > <b>Todos</b></a>
                <span className='icon' onClick={logout} ><FaArrowRightFromBracket /></span>
                {/* <Link to='/login'  >hei</Link> */}
            </nav>

        </span>
    )
}

export default Header