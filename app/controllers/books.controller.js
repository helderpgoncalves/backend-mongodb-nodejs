const db = require("../models");
const Book = db.books;

// Get all Books
exports.findAll = (req, res) => {
  Book.find()
    .then((books) => {
      res.send(books);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while getting the Books.",
      });
    });
};

// Create Book
exports.create = (req, res) => {
  // Validate request
  if (!req.body.title || !req.body.inventory_count) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  } else {
    // Check if last book is already in the database
    Book.findOne({})
      .sort({ id: -1 })
      .then((book) => {
        if (book) {
          // Get the last book id
          const lastId = book.id;
          // Create a new book
          const newBook = new Book({
            id: lastId + 1,
            title: req.body.title,
            inventory_count: req.body.inventory_count,
          });
          // Save new book in the database
          newBook
            .save()
            .then((data) => {
              res.send(data);
            })
            .catch((err) => {
              res.status(500).send({
                message:
                  err.message || "Some error occurred while creating the Book.",
              });
            });
        } else {
          // Create a new book
          const newBook = new Book({
            id: 1,
            title: req.body.title,
            inventory_count: req.body.inventory_count,
          });
          // Save new book in the database
          newBook
            .save()
            .then((data) => {
              res.send(data);
            })
            .catch((err) => {
              res.status(500).send({
                message:
                  err.message || "Some error occurred while creating the Book.",
              });
            });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Book.",
        });
      });
  }
};

// Find One
exports.findOne = (req, res) => {
  Book.findOne({ id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).send({
          message: "Book not found with id " + req.params.id,
        });
      }
      res.send(book);
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Some error occurred while retrieving book.",
      });
    });
};

// Update Book
exports.update = (req, res) => {
  // Validate Request
  if (!req.body.title) {
    return res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  // Find Book and update it with the request body
  Book.findByIdAndUpdate(
    { id: req.params.id },
    {
      title: req.body.title,
      inventory_count: req.body.inventory_count,
    },
    { new: true }
  )
    .then((book) => {
      if (!book) {
        return res.status(404).send({
          message: "Book not found with id " + req.params.id,
        });
      } else {
        res.send(book);
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Book with id " + req.params.id,
      });
    });
};

// Delete Book
exports.delete = (req, res) => {
  Book.findByIdAndRemove({ id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).send({
          message: "Book not found with id " + req.params.id,
        });
      } else {
        res.send({ message: "Book deleted successfully!" });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Book with id " + req.params.id,
      });
    });
};

// Delete all Books
exports.deleteAll = (req, res) => {
  Book.remove()
    .then((books) => {
      res.send({ message: "All Books deleted successfully!" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all Books.",
      });
    });
};

exports.updateInventory = (req, res) => {
  Book.findOne({ id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).send({
          message: "Book not found with id " + req.params.id,
        });
      }
      if (req.body.inventory_count) {
        book.inventory_count = req.body.inventory_count;
      }
      book
        .save()
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while updating the Book.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while updating the Book.",
      });
    });
};
