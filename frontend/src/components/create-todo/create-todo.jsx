import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import Toasts from "../../shared-components/toasts";

import Spinner from 'react-bootstrap/Spinner';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import * as formik from 'formik';
import * as yup from 'yup';
import { addTodoService, updateTodoService } from "../../services/api";
import { useRecoilState } from "recoil";
import { showToastAtom, toastMessageAtom } from "../../store/atoms/todo";
import './style.css'

function CreateTodo() {

    const location = useLocation()


    const navigate = useNavigate()
    const [showSpinner, setShowSpinner] = useState(false);
    const [showToast, setShowToast] = useRecoilState(showToastAtom);
    const [toastMessage, setToastMessage] = useRecoilState(toastMessageAtom);
    const [isUpdate, setIsUpdate] = useState(false)
    const [action, setAction] = useState('Add')
    const createTodo = async (todo) => {

        setShowSpinner(true)
        let response;
        if (isUpdate) {
            response = await updateTodoService(todo)
        }
        else {
            todo['isCompleted'] = false;
            response = await addTodoService(todo)
        }
        setShowSpinner(false)
        setShowToast(true)


        if (response.data.status == 200) {
            setToastMessage(`Successfully ${action}ed Todo!`)
            setTimeout(() => {
                navigate(`/user/list/${location.state.type}`)
            }, 1000)
        }
        else {
            setToastMessage('Something went wrong, Please try again later!')
        }

    }

    function cancelTodo() {
        navigate(`/user/list/${location.state.type}`)
    }
    const { Formik } = formik;

    const schema = yup.object().shape({
        title: yup.string().required('Please Enter Title').min(3, 'Must contain atleast 3 characters'),
        description: yup.string(),
        date: yup.string().required(),
        time: yup.string().required(),
    });

    let initialValues = {
        title: '',
        description: '',
        date: '',
        time: ''
    }

    useEffect(() => {
        if (location?.state) {
            if (Object.keys(location?.state).length) {
                if (location.state.type == 'Update') {
                    initialValues = location?.state
                    setIsUpdate(true)
                    setAction('Update')
                }

            }
        }
    }, [])

    return (
        <>
            <h4>{action} Todo</h4>
            {showToast ? <Toasts message={toastMessage} showToast={showToast} setShowToast={setShowToast} /> : null}
            <Formik
                validationSchema={schema}
                onSubmit={(values) => { createTodo(values) }}
                initialValues={location?.state ? location.state : initialValues}
            >
                {({ handleSubmit, handleChange, values, touched, errors }) => (
                    <Form noValidate onSubmit={handleSubmit}>
                        <Row className="mb-3">
                            <Form.Group as={Col} md="8" controlId="validationFormik01">
                                <FloatingLabel controlId="floatingTitle" label="Title" className="mb-3">
                                    <Form.Control type="text" placeholder="Title" name="title" value={values.title} onChange={handleChange} isInvalid={!!errors.title} />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.title}
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} md="8" controlId="validationFormik02">
                                <FloatingLabel controlId="floatingDescription" label="Description" className="mb-3">
                                    <Form.Control type="text" placeholder="Description" name="description" value={values.description} onChange={handleChange} isInvalid={!!errors.description} />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.description}
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} md="4" controlId="validationFormik03">
                                <FloatingLabel controlId="floatingDate" label="Date" className="mb-3">
                                    <Form.Control type="date" placeholder="Date" name="date" value={values.date} onChange={handleChange} isInvalid={!!errors.date} />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.date}
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Form.Group>
                            <Form.Group as={Col} md="4" controlId="validationFormik04">
                                <FloatingLabel controlId="floatingTime" label="Time" className="mb-3">
                                    <Form.Control type="time" placeholder="Time" name="time" value={values.time} onChange={handleChange} isInvalid={!!errors.time} />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.time}
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Form.Group>
                        </Row>

                        <button className="btn my-primary mx-2" type="submit" disabled={Object.keys(errors).length} >
                            <Spinner
                                as="span"
                                animation="none"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                            <b>{showSpinner ? 'Loading...' : action}</b></button>
                        <button className="btn my-secondary mx-1" onClick={cancelTodo} ><b>Cancel</b></button>
                    </Form>
                )}
            </Formik>
        </>
    )

}

export default CreateTodo