const express = require('express')
const router = express.Router();
const UserModel = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fetchuser = require('../middleware/fetchuser')


const JWT_SECRET = process.env.JWT_SECRET
//Route 1:  Create a user using: PORT "/api/auth/createuser"
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'passwrod must be atleast 5 charactor').isLength({ min: 5 }),
], async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        let user = await UserModel.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ success, error: "sorry the email is already exist" })
        }
        if (req.body.password !== req.body.cnfpassword) {
            return res.status(401).json({ success, error: "sorry password is note matched" })
        }

        // using bcrypt and make password hashing
        const salt = await bcrypt.genSalt(10)
        let securePass = await bcrypt.hash(req.body.password, salt)
        user = await UserModel.create({
            name: req.body.name,
            email: req.body.email,
            password: securePass,
        })


        // creating a jwt token
        const data = {
            user: {
                id: user.id
            }
        }
        const token = jwt.sign(data, JWT_SECRET)
        // console.log(token);
        success = true
        res.status(200).json({ success, token })
    } catch (error) {
        return res.status(500).json({ error: "some error occure" })
    }

    // check whether the user is exist already
    // .then((userData)=>{res.send(userData)})
    // .catch((err)=>{res.send({status:'please Enter unique email',error:err})})

})


//Route 2:  Authenticate the  user using: PORT "/api/auth/login"
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'passwrod cannot be blank').exists(),
], async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // verify the suer using the email
    const { email, password } = req.body
    try {
        let user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(400).json({ 'status': 'failed', 'error': 'sorry please try to login with correct credential' });
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            success = false
            return res.status(400).json({ 'status': 'failed', 'error': 'sorry please try to login with correct credential' });
        }

        const data = {
            user: {
                id: user.id
            }
        }
        const token = jwt.sign(data, JWT_SECRET)
        success = true
        res.status(200).json({ success, token })
    } catch (error) {
        return res.status(400).json({ 'error': "internal server error" });
    }


})


//Route 3:  get login user details using: PORT "/api/auth/getuser"

router.post('/getuser', fetchuser, async (req, res) => {

    try {
       const  userId = req.user.id
        const user = await UserModel.findById(userId).select("-password")
        res.status(200).send(user)
    } catch (error) {
        return res.status(400).json({ 'error': "internal server error" });
    }
})


module.exports = router