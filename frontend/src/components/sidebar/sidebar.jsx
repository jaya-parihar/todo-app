import './style.css'
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode";
import Avatar from '../../assets/m_avatar.png';

function Sidebar() {
    const username = localStorage.getItem('username')
    const imageUrl = localStorage.getItem('imageUrl')

    const navigate = useNavigate();

    function goToTodos(e) {
        if (e.target.innerText == 'Today' || e.target.innerText == 'Upcoming' || e.target.innerText == 'All' || e.target.innerText == 'Completed')
            navigate(`/user/list/${e.target.innerText}`, { state: { id: e.target.innerText } })
    }

    function goToProfile() {
        navigate('/user/profile')
    }


    return (
        <div className='sidebar' >
            <ul className="list-group" >

                <li className="list-group-item d-flex align-items-center" id={window.location.pathname == '/user/profile' ? 'active' : ''} onClick={goToProfile} >
                    <span className='pr-2' ><img src={imageUrl || Avatar} alt="Avatar" className='avatar' /></span>

                    <span><b>{username}</b></span>
                </li>
                <li className="list-group-item" id={window.location.pathname == '/user/list/All' ? 'active' : ''} onClick={goToTodos.bind(this)} ><b>All</b></li>
                <li className="list-group-item" id={window.location.pathname == '/user/list/Today' ? 'active' : ''} onClick={goToTodos.bind(this)} ><b>Today</b></li>
                <li className="list-group-item" id={window.location.pathname == '/user/list/Upcoming' ? 'active' : ''} onClick={goToTodos.bind(this)} ><b>Upcoming</b></li>
                <li className="list-group-item" id={window.location.pathname == '/user/list/Completed' ? 'active' : ''} onClick={goToTodos.bind(this)} ><b>Completed</b></li>
                {/* <li className="list-group-item" id={window.location.pathname == '/user/list/Completed' ? 'active' : ''} onClick={goToTodos.bind(this)} ><b>Settings</b></li> */}

            </ul>

        </div>

    )
}

export default Sidebar
