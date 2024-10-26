const express = require('express');
const bcrypt = require('bcryptjs');
const HttpStatus = require('../Utils/HttpStatusTexts')
const AsyncWrapper = require('../midllwers/AsyncWrapper')
const AppError = require('../Utils/AppError')
const app = express();
app.use(express.json());


const user = require('../mongooseModule/userSchema');
const GenerateJwt = require('../Utils/GenerateJwt');


const GetAllUsers = AsyncWrapper(async (req, res) => {

    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit

    const users = await user.find({}, { "__v": false, "password": false }).limit(limit).skip(skip);
    res.json({ status: HttpStatus.SUCCESS, data: { users } });
});

const register = AsyncWrapper(async (req, res, next) => {

    const { firstName, lastName, email, password, role } = req.body;

    const oldUser = await user.findOne({ email: email });

    if (oldUser) {
        const error = AppError.create('user allready exists', 400, HttpStatus.FAIL);
        return next(error);
    }

    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new user({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role,
        avatar:req.file.filename
    })

    // generate jwt token
    const token = await GenerateJwt({ email: newUser.email, id: newUser._id, role: newUser.role })
    newUser.token = token;

    await newUser.save()
    res.status(201).json({ status: HttpStatus.SUCCESS, data: { user: newUser } })

})


const login = AsyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        const error = AppError.create('Email and password are required', 400, HttpStatus.FAIL);
        return next(error);
    }

    // Find the user by email
    const loginUser = await user.findOne({ email });

    // If user not found, return an error
    if (!loginUser) {
        const error = AppError.create('Invalid credentials', 401, HttpStatus.FAIL); // Use 401 Unauthorized
        return next(error);
    }

    // Check if the provided password matches the stored hashed password
    const matchedPassword = await bcrypt.compare(password, loginUser.password);

    // If passwords match, log the user in
    if (matchedPassword) {
        const token = await GenerateJwt({ email: loginUser.email, id: loginUser._id, role: loginUser.role })
        return res.status(200).json({ status: HttpStatus.SUCCESS, data: token });
    } else {
        const error = AppError.create('Invalid credentials', 401, HttpStatus.FAIL); // Use 401 Unauthorized
        return next(error);
    }
});



module.exports = {
    GetAllUsers,
    register,
    login
}