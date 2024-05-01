import axios from "axios"
import { useRecoilState } from "recoil"
import { userAtom } from "../store/atoms/todo"
// const { BASE_URL } = process.env
// const URL = `${BASE_URL}/user`
import constant from '../constant'
const URL = constant.BASE_URL

export const fetchTodosService = async (type) => {
    const result = await axios.post(URL + '/todos', { type }, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    })
    return result;
}

export const loginUserService = async (user) => {
    const result = axios.post(`${URL}/login`, user, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    })
    return result
}

export const registerUserService = async (user) => {
    const result = axios.post(`${URL}/`, user, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    })
    return result
}

export const addTodoService = async (todo) => {
    const result = await axios.post(URL + '/todo', { todo }, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    })
    return result;
}

export const updateTodoService = async (todo) => {
    const result = await axios.put(URL + '/todo', { todo }, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    })
    return result;
}

export const markAsCompletedService = async (isCompleted, id) => {
    const result = await axios.put(URL + '/completed', { isCompleted }, {
        params: { id },
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    })
    return result;
}

export const uploadImageService = async (formData) => {
    const result = await axios.post(URL + '/profileImage', formData, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    })
    return result
}

export const getUserProfileService = async () => {
    const result = await axios.get(URL + '/profile', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    })
    return result
}

export const updateProfileService = async (profile) => {
    const result = await axios.put(URL + '/profile', profile, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    })
    return result;
}
