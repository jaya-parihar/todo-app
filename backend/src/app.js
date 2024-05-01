const express = require('express')
const app = express()
const dotenv = require('dotenv')
const cors = require('cors')
const path = require("path")
const fs = require('fs')
dotenv.config()
const userRouter = require('./routers/user-router')

app.use(cors())
app.use(express.json())
app.use(express.static(__dirname + '../uploads'))

const { PORT } = process.env

if (!fs.existsSync(path.join(__dirname, "../uploads"))) {
    fs.mkdirSync(path.join(__dirname, "../uploads"));
}

app.use('/user', userRouter)

app.get('/static/:filepath', (req, res) => {
    res.sendFile(path.join(__dirname, "../uploads", req.params.filepath))
})

app.get("/", (req, res) => {
    res.json({ message: 'Working' })
})

app.listen(PORT, () => {
    console.log(`server started! on ${PORT}`);
})