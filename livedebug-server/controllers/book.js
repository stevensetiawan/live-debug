const Book = require('../models').Book;

class BookController {
  create(req, res, next) {
    const { isbn, title, author, category, stock } = req.body;
    Book.create({ isbn, title, author, category, stock })
      .then(function(newBook) {
        res.status(201).json(newBook);
      })
      .catch(next);
  }
}

module.exports = BookController;
