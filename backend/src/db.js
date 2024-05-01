const mongoose = require('mongoose')
const { string } = require('zod')
const { DB_CONNECTION_STRING } = process.env

mongoose.connect(DB_CONNECTION_STRING)

const todoSchema = {
    title: String,
    description: String,
    date: { type: Date, default: Date.now() },
    time: String,
    isCompleted: Boolean
}
const userSchema = {
    name: String,
    email: { type: String, unique: true, index: true },
    password: String,
    imageUrl: String

}

exports.todosModel = mongoose.model("todos", mongoose.Schema(todoSchema));
exports.userModel = mongoose.model("users", mongoose.Schema(userSchema));
