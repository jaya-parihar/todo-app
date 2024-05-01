exports.respMessage = {
    SUCCESS: 'Success',
    ISE: 'Internal Server Error',
    BAD_REQ: 'Bad Request',
    NF: 'Not Found',
    UA: 'Unauthorised Access'
}

exports.RESPONSE = ({ status = 200, message, data }) => {
    if (!status) status = 200;
    if (!message) message = module.exports.respMessage.SUCCESS
    return ({ status, message, data })
}

exports.ISE_RESPONSE = () => {
    return ({ status: 500, message: this.respMessage.ISE })
}