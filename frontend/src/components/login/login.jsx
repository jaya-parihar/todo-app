import * as formik from "formik"
import * as yup from 'yup'
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

import Toasts from "../../shared-components/toasts";
import './style.css'
import { useRecoilState } from "recoil";
import { accessTokenAtom, userAtom } from "../../store/atoms/todo";
import { jwtDecode } from "jwt-decode";
import { loginUserService } from "../../services/api";

function Login({ isLogin, setIsLogin }) {


    const { Formik } = formik
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const navigate = useNavigate()
    const [user, setUser] = useRecoilState(userAtom)
    const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom)

    useEffect(() => {
        if (!localStorage.getItem('access_token')) {
            setIsLogin(false)
        }
    }, [])

    const schema = yup.object().shape({
        email: yup.string().email().required('Please enter email'),
        password: yup.string().required("Please enter password").min(8)
    })

    const login = async (user) => {
        const result = await loginUserService(user)
        setShowToast(true)

        if (result.data.status == 200) {
            setToastMessage("Successfully Signed In!")

            setIsLogin('true')

            setUser(jwtDecode(result.data.data.access_token).payload.name)
            setAccessToken(result.data.data.access_token)
            localStorage.setItem('access_token', result.data.data.access_token)
            localStorage.setItem('username', result.data.data.user.name)
            localStorage.setItem('imageUrl', result.data.data.user.imageUrl)
            setTimeout(() => {
                navigate("/user/list/Today")
            }, 1000);
        } else if (result.data.status == 404) {
            setToastMessage("User not registered!")
            setTimeout(() => {
                navigate('/register')
            }, 1000);
        }
        else if (result.data.status == 401) {
            setToastMessage("Invalid credentials!")
        }
        else {
            setToastMessage("Something went wrong. Please try again later!")
        }
    }


    return (
        <div className="login-container" >
            {showToast ? <Toasts message={toastMessage} showToast={showToast} setShowToast={setShowToast} /> : null}
            <Formik
                validationSchema={schema}
                onSubmit={(values) => { login(values) }}
                initialValues={
                    {
                        email: '',
                        password: ''
                    }
                }
            >
                {({ handleSubmit, handleChange, values, touched, errors }) => (

                    <div >
                        <div className="card " style={{ width: '20rem' }}>
                            <div className="card-body">
                                <h4 className="card-title">Sign In </h4>
                                <Form noValidate onSubmit={handleSubmit} >
                                    <Row className="mb-2" >
                                        <Form.Group as={Col} md="12" controlId="validationFormik02" >
                                            <FloatingLabel controlId="floatingEmail" label="Email" className="mb-2" >
                                                <Form.Control type="text" placeholder="Enter Your Email" name="email" value={values.email} onChange={handleChange} isInvalid={!!errors.email} ></Form.Control>
                                                <Form.Control.Feedback type="invalid" >
                                                    {errors.email}
                                                </Form.Control.Feedback>
                                            </FloatingLabel>
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-2" >
                                        <Form.Group as={Col} md="12" controlId="validationFormik03" >
                                            <FloatingLabel controlId="floatingName" label="Password" className="mb-2" >
                                                <Form.Control type="password" placeholder="Enter Your Password" name="password" value={values.password} onChange={handleChange} isInvalid={!!errors.password} ></Form.Control>
                                                <Form.Control.Feedback type="invalid" >
                                                    {errors.password}
                                                </Form.Control.Feedback>
                                            </FloatingLabel>
                                        </Form.Group>
                                    </Row>
                                    <button className="btn my-primary mx-1" type="submit">Sign In</button>
                                    <p>Don't have an account?
                                        <Link to={"/register"} >Sign Up</Link>
                                    </p>
                                </Form>
                            </div>

                        </div>
                    </div>
                )}
            </Formik >
        </div>
    )
}

export default Login
