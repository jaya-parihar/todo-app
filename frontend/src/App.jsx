import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/header/header'
import Sidebar from './components/sidebar/sidebar'
import Content from './components/content/content'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from "jwt-decode";
import { useEffect } from 'react'
import { RecoilRoot, useRecoilState } from 'recoil'
import { accessTokenAtom, userAtom } from './store/atoms/todo'
import { BrowserRouter } from 'react-router-dom'

function App() {
  return (
    <RecoilRoot>
      <Root />
    </RecoilRoot>
  )
}

function Root() {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom);

  const [isLogin, setIsLogin] = useState(false)
  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      setIsLogin(true)
    }
  }, [])

  return (
    <RecoilRoot>
      <BrowserRouter>
        <div className='row justify-content-center' >
          <div className="col-md-8">
            <span>{isLogin && <div><Header /></div>}</span>
            <div className='main-body' >
              <div>
                {isLogin && <Sidebar />}
              </div>
              <div className='content' >
                <Content isLogin={isLogin} setIsLogin={setIsLogin} />
              </div>
            </div>
          </div>

        </div>
      </BrowserRouter>
    </RecoilRoot>
  )
}

export default App
