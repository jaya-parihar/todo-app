const jwt = require("jsonwebtoken")
const { RESPONSE, ISE_RESPONSE, respMessage } = require("../utils/response")
const { AUTH_SECRET_KEY, AUTH_TOKEN_EXPIRY_TIME } = process.env
exports.createAuthToken = (payload) => {

    return new Promise((resolve, reject) => {
        try {
            const token = jwt.sign({ payload }, AUTH_SECRET_KEY, {
                expiresIn: AUTH_TOKEN_EXPIRY_TIME
            })
            return resolve(token)
        } catch (error) {
            return reject(error)
        }
    })
}

exports.verifyJWT = (req, res, next) => {
    try {
        const access_token = req.headers.authorization.split(' ')[1]


        if (access_token) {
            const payload = jwt.verify(access_token, AUTH_SECRET_KEY)
            req.payload = payload
            return next()
        }
    } catch (error) {
        console.log(error.message || error);
        res.json(RESPONSE({ status: 401, message: respMessage.UA }))
    }
}
