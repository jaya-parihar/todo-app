const { todosModel, userModel } = require("../db");
const { createAuthToken } = require("../middlewares/auth");
const { createTodoSchema, idSchema, userSchema, loginSchema } = require("../middlewares/validations")
const { ISE_RESPONSE, RESPONSE, respMessage } = require("../utils/response")
const { BASE_URL } = process.env

exports.register = async (req, res) => {
    try {
        const parsedUser = userSchema.safeParse(req.body);
        if (!parsedUser.success) {
            return res.json(RESPONSE({ status: 400, message: respMessage.BAD_REQ }))
        }
        const result = await userModel.create(parsedUser.data)
        res.json(RESPONSE({ data: result._id }))

    } catch (error) {
        console.log(error.message || error);
        if (error.code == 11000)
            return res.json(RESPONSE({ status: 409, message: 'User already registered!' }))
        res.json(ISE_RESPONSE())
    }
}

exports.login = async (req, res) => {
    const parsedUser = loginSchema.safeParse(req.body)
    if (!parsedUser.success) {
        res.json(RESPONSE({ status: 400, message: respMessage.BAD_REQ }))
    }
    let result = await userModel.findOne({ email: parsedUser.data.email })
    if (!result) return res.json(RESPONSE({ status: 404, message: respMessage.NF }))

    if (result.password != parsedUser.data.password)
        return res.json(RESPONSE({ status: 401, message: "Invalid Credentials" }))

    result = result._doc
    result.imageUrl = result.imageUrl && `${BASE_URL}/static/${result.imageUrl}`
    const { password, ...user } = result;

    const access_token = await createAuthToken(result)
    res.json(RESPONSE({ data: { access_token, user } }))
}

exports.createTodo = async (req, res) => {
    try {

        const parsedTodo = createTodoSchema.safeParse(req.body.todo);
        if (!parsedTodo.success) {
            return res.json(RESPONSE({ status: 400, message: parsedTodo }))
        }
        const result = await todosModel.create(parsedTodo.data)

        res.json(RESPONSE({ data: { id: result._id } }))
    } catch (error) {

        console.log(error.message || error);
        res.json(ISE_RESPONSE())
    }
}

exports.listTodos = async (req, res) => {
    try {
        let d = new Date()
        const type = req.body.type.toLowerCase()
        let result, endDate;
        let startDate = `${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}-${("0" + d.getDate()).slice(-2)}`;
        d.setDate(d.getDate() + 1)

        switch (type) {
            case 'all':
                result = await todosModel.find().sort({ date: 1 });
                break;
            case 'completed':
                result = await todosModel.find({ isCompleted: true }).sort({ date: 1 })
                break;
            case 'today':
                endDate = `${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}-${("0" + d.getDate()).slice(-2)}`;
                result = await todosModel.find({
                    date: {
                        $gte: new Date(startDate),
                        $lt: new Date(endDate)
                    }
                }).sort({ date: 1 })
                break;
            case 'upcoming':
                startDate = `${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}-${("0" + d.getDate()).slice(-2)}`;
                d.setDate(d.getDate() + 6)
                endDate = `${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}-${("0" + d.getDate()).slice(-2)}`;
                result = await todosModel.find({
                    date: {
                        $gte: new Date(startDate),
                        $lt: new Date(endDate)
                    }
                }).sort({ date: 1 })
                break;
            default:
                return res.json(RESPONSE({ status: 400, message: respMessage.BAD_REQ }))
        }


        return res.json(RESPONSE({ data: result }))

    } catch (error) {
        console.log(error.message || error);
        res.json(ISE_RESPONSE())
    }
}

exports.completed = async (req, res) => {
    try {
        const parsedID = idSchema.safeParse(req.query.id)
        const isCompleted = req.body.isCompleted
        if (!parsedID.success) {
            return res.json(RESPONSE({ status: 400, message: respMessage.BAD_REQ }))
        }
        const result = await todosModel.findOneAndUpdate({ _id: parsedID.data }, { isCompleted: isCompleted });
        res.json(RESPONSE({ status: 200, message: respMessage.SUCCESS }))
    } catch (error) {
        console.log(error.message || error);
        res.json(ISE_RESPONSE())
    }
}

exports.uploadProfileImage = async (req, res) => {
    try {
        const result = await userModel.findOneAndUpdate({ _id: req.payload.payload._id }, {
            imageUrl: req.file.filename
        })

        res.json(RESPONSE({ message: respMessage.SUCCESS, data: { imgUrl: `${BASE_URL}/static/${req.file.filename}` } }))
    } catch (error) {
        console.log(error.message || error);
        res.json(ISE_RESPONSE())
    }
}

exports.updateTodo = async (req, res) => {
    try {
        const ID = req.body.todo.id;
        const parsedTodo = createTodoSchema.safeParse(req.body.todo)
        if (!parsedTodo.success) {
            return res.json(RESPONSE({ status: 400, message: respMessage.BAD_REQ }))
        }
        const result = await todosModel.findOneAndUpdate({ _id: ID }, {
            "$set": {
                "title": parsedTodo.data.title,
                "description": parsedTodo.data.description,
                "date": parsedTodo.data.date,
                "time": parsedTodo.data.time,
            }
        })
        res.json(RESPONSE({ data: result }))
    } catch (error) {
        console.log(error.message || error);
        res.json(ISE_RESPONSE())
    }
}

exports.getProfile = async (req, res) => {
    try {
        const ID = req.payload.payload._id;
        const result = await userModel.find({ _id: ID })
        result[0].imageUrl = `${BASE_URL}/static/${result[0].imageUrl}`
        res.json(RESPONSE({ data: result }))
    } catch (error) {
        console.log(error.message || error);
        res.json(ISE_RESPONSE())
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const { name, pswd } = req.body
        const ID = req.payload.payload._id
        let result = await userModel.findOneAndUpdate({ _id: ID }, { name: name, password: pswd })
        result = result._doc
        const { password, ...user } = result
        user.name = name
        res.json(RESPONSE({ data: user }))
    } catch (error) {
        console.log(error.message || error);
        res.json(ISE_RESPONSE())
    }
}