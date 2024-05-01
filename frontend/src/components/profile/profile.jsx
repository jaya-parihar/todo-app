import { useEffect, useRef, useState } from "react"
import Avatar from '../../assets/m_avatar.png';
import { BsPencilSquare } from "react-icons/bs";
import axios from "axios";
import * as yup from 'yup'
import * as formik from 'formik'
import Form from 'react-bootstrap/Form'
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col"
import FloatingLabel from "react-bootstrap/esm/FloatingLabel";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { getUserProfileService, updateProfileService, uploadImageService } from '../../services/api'

import './style.css'
import Toasts from "../../shared-components/toasts";
import { showToastAtom, toastMessageAtom } from "../../store/atoms/todo";
import { useRecoilState } from "recoil";
function Profile() {

    const { Formik } = formik

    const imgUrl = localStorage.getItem('imageUrl')

    const [avatar, setAvatar] = useState(imgUrl || Avatar)
    const [username, setUsername] = useState('')
    const fileUploadRef = useRef();
    const uploadImage = (event) => {
        event.preventDefault()
        fileUploadRef.current.click();
    }

    let initialValues = {
        name: '',
        password: '',
        confirmPassword: ''
    }

    const [showToast, setShowToast] = useRecoilState(showToastAtom);
    const [toastMessage, setToastMessage] = useRecoilState(toastMessageAtom);

    const fetchProfile = async () => {
        const result = await getUserProfileService()
        initialValues.name = result.data.data[0].name
        setUsername(result.data.data[0].name)
        setAvatar(result.data.data[0].imageUrl)

    }

    useEffect(() => {
        fetchProfile()

    }, [])

    const uploadImageDisplay = async () => {
        const uploadedFile = fileUploadRef.current.files[0]
        // const cachedFile = URL.createObjectURL(uploadedFile)
        // setAvatar(cachedFile)
        const formData = new FormData()
        formData.append('image', uploadedFile)
        const result = await uploadImageService(formData)
        // const result = await axios.post('http://localhost:3000/user/profileImage', formData)
        if (result.data.status == 200) {
            setAvatar(result?.data.data.imgUrl)
            localStorage.setItem('imageUrl', result.data.data.imgUrl)
        }
    }


    const schema = yup.object().shape({
        name: yup.string().min(3).max(20).required(),
        password: yup.string().required().min(8),
        confirmPassword: yup.string().min(8).required()
    })

    const updateProfile = async (profile) => {
        if (profile.password != profile.confirmPassword) {
            setShowToast(true)
            setToastMessage('Password and Confirm Password Must Match!')
            return
        }
        const result = await updateProfileService(profile)
        if (result.data.status == 200) {
            initialValues = {}
            setShowToast(true)
            setToastMessage('Profile Updated Successfully')
        }
    }



    return (
        <>
            {showToast ? <Toasts message={toastMessage} showToast={showToast} setShowToast={setShowToast} /> : null}
            <div className="d-flex flex-column justify-content-center">
                <div className="profile" >
                    <div className="relative" style={{ height: '13rem', width: '13rem' }} >
                        <img className="profile-photo" src={avatar} alt="" />

                        <form id="form" encType="mutlipart/form-data" >
                            <button type="submit" className="edit-icon" onClick={uploadImage} ><BsPencilSquare /></button>
                            <input type="file" id="file" hidden ref={fileUploadRef} onChange={uploadImageDisplay} />
                        </form>
                    </div>
                </div>
                <div className="row justify-content-center" >
                    <div className="col-md-8">
                        <Formik
                            validationSchema={schema}
                            onSubmit={(values) => { updateProfile(values) }}
                            initialValues={
                                initialValues
                            }
                        >
                            {({ handleSubmit, handleChange, values, touched, errors }) => (

                                <div >
                                    <div >
                                        <div >

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
                                                    <Form.Group as={Col} md="6" controlId="validationFormik02" >
                                                        <FloatingLabel controlId="floatingPassword" label="Password" className="mb-2" >
                                                            <Form.Control type="password" placeholder="Password" name="password" value={values.password} onChange={handleChange} isInvalid={!!errors.password} ></Form.Control>
                                                            <Form.Control.Feedback type="invalid" >
                                                                {errors.password}
                                                            </Form.Control.Feedback>
                                                        </FloatingLabel>
                                                    </Form.Group>
                                                    <Form.Group as={Col} md="6" controlId="validationFormik03" >
                                                        <FloatingLabel controlId="floatingCnfPassword" label="Confirm Password" className="mb-2" >
                                                            <Form.Control type="password" placeholder="Confirm Password" name="confirmPassword" value={values.confirmPassword} onChange={handleChange} isInvalid={!!errors.confirmPassword} ></Form.Control>
                                                            <Form.Control.Feedback type="invalid" >
                                                                {errors.confirmPassword}
                                                            </Form.Control.Feedback>
                                                        </FloatingLabel>
                                                    </Form.Group>
                                                </Row>
                                                <button className="btn my-primary mx-1" type="submit">Update Profile</button>

                                            </Form>
                                        </div>

                                    </div>
                                </div>
                            )}
                        </Formik >
                    </div>
                </div>

            </div>
        </>
    )
}

export default Profile
