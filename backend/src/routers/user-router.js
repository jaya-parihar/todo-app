const express = require('express')
const { createTodo, listTodos, completed, updateTodo, register, login, uploadProfileImage, getProfile, updateProfile } = require('../controllers/user-controller')
const { verifyJWT } = require('../middlewares/auth')
const { uploadProfileImageMid } = require('../middlewares/imageHandler')
const router = express.Router()

router.post('/todo', verifyJWT, createTodo)
router.post('/todos', verifyJWT, listTodos)
router.put('/completed', verifyJWT, completed)
router.put('/todo', verifyJWT, updateTodo)
router.post('/register', register)
router.post('/login', login)
router.get('/profile', verifyJWT, getProfile)
router.put('/profile', verifyJWT, updateProfile)
router.post('/profileImage', verifyJWT, uploadProfileImageMid.single('image'), uploadProfileImage)

// export default router
module.exports = router