
const express = require('express');

const HttpStatus = require('../Utils/HttpStatusTexts')
const AsyncWrapper = require('../midllwers/AsyncWrapper')
const AppError = require('../Utils/AppError')
const app = express();
app.use(express.json());


const Book = require('../mongooseModule/BookSotoreSchema');

const GetAllBooks = AsyncWrapper(async (req, res) => {

    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit

    const books = await Book.find({}, { "__v": false }).limit(limit).skip(skip);
    res.json({ status: HttpStatus.SUCCESS, data: { books } });
});




const GetOneBook = AsyncWrapper(
    async (req, res, next) => {
        const bookId = req.params.id;

        const book = await Book.findById(bookId);
        if (!book) {
            const error = AppError.create('book not found', 404, HttpStatus.FAIL);
            return next(error);
        }
        res.status(200).json({ status: HttpStatus.SUCCESS, data: { book } })

    }
)

const AddBook = AsyncWrapper(async (req, res) => {
    const newBook = new Book(req.body);
    const book = await newBook.save()
    res.status(201).json({ status: HttpStatus.SUCCESS, data: { book } })
});

const UpdateOneBook = AsyncWrapper(async (req, res, next) => {
    const bookId = req.params.id;

    const updateCourse = await Book.updateOne({ _id: bookId }, { $set: { ...req.body } });
    return res.status(200).json({
        status: HttpStatus.SUCCESS,
        data: { updateCourse }
    });


});

const DeleteBook = async (req, res,next) => {
    const bookId = req.params.id;


    const deleteResult = await Book.deleteOne({ _id: bookId });

    // Check if a book was actually deleted
    if (deleteResult.deletedCount === 0) {
        const error = AppError.create('book not found', 404, HttpStatus.FAIL);
        return next(error);
    }
    return res.status(200).json({
        status: HttpStatus.SUCCESS,
        data: null
    });

}
//

module.exports = {
    GetAllBooks,
    GetOneBook,
    AddBook,
    UpdateOneBook,
    DeleteBook,
}