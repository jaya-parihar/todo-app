const express = require('express')
const { createTodo, updateTodo } = require('./types')
const app = express()
const cors =  require("cors")

const { todo } = require('./db')

app.use(express.json())
app.use(cors())

app.get('/todos', async (req, res)=> {
    const todos = await todo.find({})
    console.log(todos);
    res.json({todos})
})

app.post('/todo', async (req,res) => {
    const newTodo = createTodo.safeParse(req.body)
    console.log(newTodo);
    if(!newTodo.success) {
        return res.status(411).json({message: "Invalid Input!"})
    } 
    const result = await todo.create({
        title: newTodo.data.title,
        description: newTodo.data.description,
        completed: false
    })
    res.json({message: 'Todo Created Successfully!', result})
})

app.put('/completed', async (req, res) => {
    const parsedTodo =  updateTodo.safeParse(req.body)
    if(!parsedTodo.success) {
        return res.status(411).json({message: "Invalid Input!"})
    }

    const result = await todo.findOneAndUpdate({_id: parsedTodo.data.id},{ completed: true })
    console.log(result);
    res.json({message: "Todo marked as completed!",result})
})



app.listen(3000,()=>{
    console.log('Server Started');
})