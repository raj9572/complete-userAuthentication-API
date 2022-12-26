const jwt = require('jsonwebtoken')
const JWT_TOKEN = process.env.JWT_SECRET

const fetchuser = async (req, res, next) => {
    // the the token from header
    const token = req.header('auth-token')
    // console.log(token)

    if (!token) {
        res.status(401).send({ status: 'failed', messagee: 'please authenticate a valid token1' })
    }
    try {
        const data = jwt.verify(token, JWT_TOKEN)
        req.user = data.user
        next();

    } catch (error) {
        res.status(401).send({ status: 'failed', messagee: 'please authenticate a valid token2' })
    }

}

module.exports = fetchuser
