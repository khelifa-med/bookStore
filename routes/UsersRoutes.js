const express = require('express');

const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const uniqueSuffix = `user-${Date.now()}.${ext}`
        cb(null, uniqueSuffix)
    }
})


const fileFilter = (req, file, cb) => {

    const imageFile = file.mimetype.split('/')[0];

    if (imageFile === 'image') {
        return cb(null, true)
    } else {
        return cb(AppError.create('file must be an image', 400),false)
    }
}

const upload = multer(
    {
        storage: storage,
        fileFilter
    }
)

const router = express.Router()
const { GetAllUsers, register, login } = require('../controllers/UsersControler');
const { verifyToken } = require('../midllwers/verifyToken');
const AppError = require('../Utils/AppError');



// Define your routes here

// get all users 

router.route('/')
    .get(verifyToken, GetAllUsers)

// register

router.route('/register')
    .post(upload.single('avatar'), register)

// login

router.route('/login')
    .post(login)

module.exports = router;