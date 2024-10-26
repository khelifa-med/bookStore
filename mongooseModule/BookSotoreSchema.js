const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewer: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  comment: String
});

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  year_published: {
    type: Number,
    required: true
  },
  genres: {
    type: [String],
    required: true
  },
  pages: Number,
  ratings: {
    average_rating: {
      type: Number,
      required: true
    },
    number_of_ratings: {
      type: Number,
      required: true
    }
  },
  description: String,
  language: {
    type: String,
    required: true
  },
  reviews: [reviewSchema]
});

const Book = mongoose.model('books', bookSchema);

module.exports = Book;
