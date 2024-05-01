const zod = require("zod")

exports.createTodoSchema = zod.object({
    title: zod.string().trim().min(3).max(200),
    description: zod.string().trim().max(500).optional().default(""),
    date: zod.string().transform((s) => new Date(s)),
    time: zod.string(),
    isCompleted: zod.boolean().default(false)
})


exports.userSchema = zod.object({
    name: zod.string().min(3).max(50).trim(),
    email: zod.string().email().trim(),
    password: zod.string().min(8).max(100).trim(),
})

exports.loginSchema = zod.object({
    email: zod.string().email().trim(),
    password: zod.string().min(8).max(100).trim()
})

exports.idSchema = zod.string().min(3).trim()