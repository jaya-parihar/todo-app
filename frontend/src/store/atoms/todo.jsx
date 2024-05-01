import { atom } from "recoil";

export const todosAtom = atom({
    key: 'todos',
    default: []
})

export const completedTodosAtom = atom({
    key: "completedTodosAtom",
    default: []
})

export const userAtom = atom({
    key: "userAtom",
    default: {}
})

export const accessTokenAtom = atom({
    key: 'accessTokenAtom',
    default: localStorage.getItem('access_token')
})

export const showToastAtom = atom({
    key: "showToastAtom",
    default: false
})

export const toastMessageAtom = atom({
    key: 'toastMessageAtom',
    default: ''
})