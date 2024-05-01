import * as formik from "formik"
import * as yup from 'yup'
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form"
import Col from "react-bootstrap/Col"
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import Toasts from "../../shared-components/toasts"
import './style.css'
import { registerUserService } from "../../services/api";

function Register() {
    const { Formik } = formik
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const navigate = useNavigate()

    const schema = yup.object().shape({
        name: yup.string().required('Please enter name').min(3),
        email: yup.string().email().required('Please enter email'),
        password: yup.string().required("Please enter password").min(8)
    })

    const registerUser = async (user) => {

        const result = await registerUserService(user)
        setShowToast(true)

        if (result.data.status == 200) {
            setToastMessage("Successfully Signed Up!")
            setTimeout(() => {
                navigate("/login")
            }, 1000);
        } else if (result.data.status == 409) {
            setToastMessage("User already registered!")
        }
        else {
            setToastMessage("Something went wrong. Please try again later!")
        }
    }

    return (
        <div className="register-container" >
            {showToast ? <Toasts message={toastMessage} showToast={showToast} setShowToast={setShowToast} /> : null}
            <Formik
                validationSchema={schema}
                onSubmit={(values) => { registerUser(values) }}
                initialValues={
                    {
                        name: '',
                        email: '',
                        password: ''
                    }
                }
            >
                {({ handleSubmit, handleChange, values, touched, errors }) => (

                    <div className="card" style={{ width: '20rem' }}>
                        <div className="card-body">
                            <h4 className="card-title">Sign Up</h4>
                            <Form noValidate onSubmit={handleSubmit} >
                                <Row className="mb-2" >
                                    <Form.Group as={Col} md="12" controlId="validationFormik01" >
                                        <FloatingLabel controlId="floatingName" label="Name" className="mb-2" >
                                            <Form.Control type="text" placeholder="Enter Your Name" name="name" value={values.name} onChange={handleChange} isInvalid={!!errors.name} ></Form.Control>
                                            <Form.Control.Feedback type="invalid" >
                                                {errors.name}
                                            </Form.Control.Feedback>
                                        </FloatingLabel>
                                    </Form.Group>
                                </Row>
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
                                            <Form.Control type="text" placeholder="Enter Your Password" name="password" value={values.password} onChange={handleChange} isInvalid={!!errors.password} ></Form.Control>
                                            <Form.Control.Feedback type="invalid" >
                                                {errors.password}
                                            </Form.Control.Feedback>
                                        </FloatingLabel>
                                    </Form.Group>
                                </Row>
                                <button className="btn my-primary mx-1" type="submit">Sign Up</button>
                                <p>Already have an account? <Link to={"/login"} >Sign in</Link> </p>
                            </Form>
                        </div>

                    </div>
                )}
            </Formik >
        </div>
    )
}

export default Register
