import { useEffect, useMemo, useState } from 'react';
import { RecoilRoot, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { completedTodosAtom, todosAtom } from '../../store/atoms/todo';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Accordion from 'react-bootstrap/Accordion';
import Form from 'react-bootstrap/Form';

import { fetchTodosService, markAsCompletedService } from '../../services/api'

import Toasts from '../../shared-components/toasts';
import './style.css'

function ListTodos() {
    const [todos, setTodos] = useRecoilState(todosAtom)
    const [completedTodos, setCompletedTodos] = useRecoilState(completedTodosAtom)
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');


    const { type } = useParams()

    const fetchTodo = async () => {
        let pendingTodos = [];
        let completedTodos = [];


        const result = await fetchTodosService(type)

        if (result.data.status == 401) {
            setShowToast(true)
            setToastMessage('Unauthorised access!')
            localStorage.clear()
            setTimeout(() => {
                navigate('/login')
            }, 1000);

        }
        else if (result.data.status == 200) {
            result.data.data.forEach(e => {
                if (e.isCompleted == true)
                    completedTodos.push(e)
                else
                    pendingTodos.push(e)
            });
            setTodos(pendingTodos)
            setCompletedTodos(completedTodos)
        }
    }

    useMemo(fetchTodo, [type]),
        useEffect(() => {
            fetchTodo()

        }, [])

    function addTodo() {
        navigate('/user/add', { state: { type: type } })
    }

    return (
        <div>
            {showToast ? <Toasts message={toastMessage} showToast={showToast} setShowToast={setShowToast} /> : null}

            <h2>{type}</h2>

            <button className='btn my-primary my-3' onClick={addTodo} ><b>+Add Todo</b></button>

            <Accordion defaultActiveKey={type == 'Completed' ? "1" : "0"}  >
                {type != 'Completed' ? <Accordion.Item eventKey="0">
                    <Accordion.Header><b>Pending Todos</b></Accordion.Header>
                    <Accordion.Body style={{ maxHeight: '400px', overflowY: 'auto' }} >
                        {todos.length > 0 ? todos.map((e) => <Todos key={e._id} title={e.title} description={e.description} time={e.time} date={e.date} isCompleted={e.isCompleted} id={e._id} term={type} />) : <h6>Try adding some todo to see them here</h6>}
                    </Accordion.Body>
                </Accordion.Item>
                    : null}
                <Accordion.Item eventKey="1" >
                    <Accordion.Header><b>Completed Todos</b> </Accordion.Header>
                    <Accordion.Body style={{ maxHeight: '400px', overflowY: 'auto' }} >
                        {completedTodos.length > 0 ? completedTodos.map((e) => <Todos key={e._id} title={e.title} description={e.description} time={e.time} date={e.date} isCompleted={e.isCompleted} term={type} id={e._id} />) : <h6>Try completing some todo to see them here</h6>}
                    </Accordion.Body>

                </Accordion.Item>
            </Accordion>
        </div>


    )
}


function Todos({ title, description, time, isCompleted, id, date, term }) {

    const [done, setDone] = useState(isCompleted);
    const setTodos = useSetRecoilState(todosAtom)
    const setCompletedTodos = useSetRecoilState(completedTodosAtom)

    const navigate = useNavigate()
    const markAsDone = async (event) => {
        const result = await markAsCompletedService(!done, id)
        if (result.data.status == 200) {
            setDone(!done)
            'here'
            setTimeout(() => {

            }, 1000);
            fetchTodo()
        }
    }
    const editTodo = (event) => {

        navigate('/user/add', { state: { title: title, description: description, date: date.split('T')[0], time: time, id: id, type: term } })
    }

    const fetchTodo = async () => {
        let pendingTodos = [];
        let completedTodos = [];

        const result = await fetchTodosService(term)


        if (result.data.status == 401) {
            setToastMessage('Unauthorised access!')
            // localStorage.clear()
            setTimeout(() => {
                navigate('/login')
            }, 1000);

        }
        else if (result.data.status == 200) {
            result.data.data.forEach(e => {
                if (e.isCompleted == true)
                    completedTodos.push(e)
                else
                    pendingTodos.push(e)
            });
            setTodos(pendingTodos)
            setCompletedTodos(completedTodos)
        }
    }



    function formatDate(inpDate) {
        let date = new Date(inpDate);
        const day = date.toLocaleString('default', { day: '2-digit' });
        const month = date.toLocaleString('default', { month: 'short' });
        return day + '-' + month;
    }

    return (
        <div className='card'  >
            <div className="card-body">
                <div className="flexRowBWContainer">
                    <div className='flexRowContainer' >
                        <span className='mt-2' > <Form.Check inline label="" type='checkbox' id='isCompleted' checked={done} onChange={markAsDone} /> </span>
                        <span ><h5 onClick={editTodo} >{title}</h5></span>
                    </div>
                    <div>
                        <h6 className='m-0' >{term == 'Today' ? 'Today' : formatDate(date)}</h6>
                        <h6 className='m-0' >{time}</h6>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListTodos