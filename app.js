require('dotenv').config()

const express = require('express');
const cors = require('cors')
const { mongoose } = require('mongoose')
const app = express();
const path = require('path');
app.use('/uploads',express.static(path.join(__dirname,'uploads')))

app.use(cors())
app.use(express.json());

const booksRouter = require('./routes/Routes')
const usersRouter = require('./routes/UsersRoutes')

const HttpStatus = require('./Utils/HttpStatusTexts')




const url=process.env.Mongo_Url;

mongoose.connect(url)
    .then(() => {
        console.log('mogodb server started...');

    })
    .catch((err) => {
        console.log('any data...');

    })

app.use('/books', booksRouter); 
app.use('/users', usersRouter);
// globale midllware for not fount routes
app.all('*', (req, res, next) => {
    return res.status(404).json({ status: HttpStatus.ERROR, message: "This resourse is not available" });
})


// globle error handler
app.use((error, req, res, next) => {
    return res.status(error.statusCode || 500)
        .json({
            status: error.statusText || HttpStatus.ERROR,
            message: error.message,
            code: error.statusCode || 500,
            data: null
        });
})


app.listen(process.env.PORT || 4000, () => {
    console.log('Listening on port 4000');
});

