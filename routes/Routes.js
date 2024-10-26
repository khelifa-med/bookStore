const express = require('express');
const router = express.Router()
const { GetAllBooks, GetOneBook, AddBook, UpdateOneBook, DeleteBook } = require('../controllers/Controlers');
const { userRules } = require('../Utils/UserRules');
const allowedTo = require('../midllwers/allowedTo');
const { verifyToken } = require('../midllwers/verifyToken');

// Define your routes here
router.route('/')
    .get(GetAllBooks)
    .post(AddBook)

router.route('/:id')
    .get(GetOneBook)
    .patch(UpdateOneBook)
    .delete(verifyToken, allowedTo(userRules.ADMIN, userRules.MANAGER), DeleteBook)

module.exports = router;