import { Routes, Route, BrowserRouter } from "react-router-dom"
import Sidebar from "../sidebar/sidebar"
import ListTodos from "../list-todos/list-todos"
import { RecoilRoot, useRecoilState } from 'recoil';
import Login from "../login/login";
import ProtectedRoute from '../../shared-components/protected-route'
import CreateTodo from "../create-todo/create-todo"
import Profile from "../profile/profile"
import Register from "../register/register"
import PageNotFound from "../page-not-found/page-not-found"
import Header from "../header/header";

function Content({ isLogin, setIsLogin }) {
    return (
        <div >

            <Routes className="main-content" >

                <Route path="/" element={<ListTodos />} />
                <Route path='/user' element={<ProtectedRoute />}  >
                    <Route path='list/:type' element={<ListTodos />} />
                    <Route path='add' element={<CreateTodo />} />
                    <Route path='profile' element={<Profile />} />
                </Route>
                <Route path='/login' element={<Login isLogin={isLogin} setIsLogin={setIsLogin} />} />
                <Route path='/register' element={<Register />} />
                <Route path='/*' element={<PageNotFound />} />
            </Routes>


        </div>
    )
}

export default Content
