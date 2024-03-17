import { useState } from 'react'

export function CreateTodo() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")

    function onClickCreateTodo () {
        fetch('http://localhost:3000/todo', {
            method: "POST",
            body: JSON.stringify({
                title,
                description 
            }), 
            headers: {
                "Content-Type": "application/json"
            }
        }).then(async (data) => {
            setTitle("");
            setDescription("");

            alert((await data.json()).message)
        }).catch((err) => {
            console.log(err)
        })
    }
    return (
        <div>
            <input id="title" type="text" placeholder="Title" onChange={(t) => {
                setTitle(t.target.value);
            }}></input>
            <br /><br />
            <input id = "description" type="text" placeholder="Description" onChange={(d) => {
                setDescription(d.target.value)
            } }></input>
            <br /><br />
            <button onClick={onClickCreateTodo}>Add a Todo</button>
        </div>
    )
}