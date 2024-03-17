import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { CreateTodo } from './components/CreateTodo'
import { Todos } from './components/Todos'

function App() {
  const [todos, setTodos] = useState([])

  return (
    <div>
      <button onClick={() => {
        fetch('http://localhost:3000/todos').then(async (data) => {
          setTodos((await data.json()).todos)
      
        }).catch((err) => {
          console.log(err)
        })
      }}>Re-Load</button><br /><br /> 
      <CreateTodo></CreateTodo>
      <Todos todos={todos}></Todos>
      </div>
  )
}

export default App

// Things to do: 
// - New todo to be added in the list
// - Need to stop infinite rendering (while listing the todo's - current ugly was a btn is there)
// - Todo's updated, but not refreshed!