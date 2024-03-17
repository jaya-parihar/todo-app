export function Todos({todos}) {
    function markAsCompleted(id) {
        fetch("http://localhost:3000/completed", {
            method: "PUT",
            body: JSON.stringify({
                id
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(async (rslt) => {
            alert((await rslt.json()).message)
        }).catch((err) => {
            console.log(err);
        })
    }
    return ( <div>
        {todos.map((todo) => {
            return (                
                <div>
                    <h4>Title: {todo.title}</h4>
                    <h5>Description: {todo.description}</h5>
                    <button onClick={markAsCompleted.bind(this, todo._id)}>{todo.completed == true ? "Completed" : "Mark as completed"}</button>
                </div>
            )
        })}
    </div> )
}