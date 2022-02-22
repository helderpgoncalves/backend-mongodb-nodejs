const db = require("../models");
const User = db.users;
const Book = db.books;

// CRUD - Create
exports.create = (req, res) => {
  // Validate request
  if (!req.body.username || !req.body.phone) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  } else {
    // Create a User
    const user = new User({
      username: req.body.username,
      phone: req.body.phone,
    });

    // Save User in the database
    user
      .save()
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User.",
        });
      });
  }
};

// Get all Users
exports.findAll = (req, res) => {
  User.find()
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

// Find User by Username
exports.findOne = (req, res) => {
  User.findOne({ username: req.params.username })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "User not found with username " + req.params.username,
        });
      }
      res.send(user);
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Some error occurred while retrieving user.",
      });
    });
};

// Edit User
exports.update = (req, res) => {
  // Validate Request
  if (!req.body.username) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Find user and update it with the request body
  User.findOneAndUpdate(
    { username: req.params.username },
    {
      username: req.body.username,
      phone: req.body.phone,
    },
    { new: true }
  ).then((user) => {
    if (!user) {
      return res.status(404).send({
        message: "User not found with username " + req.params.username,
      });
    }
    res.send(user);
  });
};

// Delete User
exports.delete = (req, res) => {
  User.findOneAndRemove({ username: req.params.username })
    .then((user) => {
      if (!user) {
        return res.status(404).send({
          message: "User not found with username " + req.params.username,
        });
      }
      res.send({ message: "User deleted successfully!" });
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Some error occurred while removing user.",
      });
    });
};

// Borrow Book from User
exports.borrow = (req, res) => {
  // Check Path Params
  if (!req.params.username || !req.params.id) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Find Book and Check if it is available
  Book.findOne({ id: req.params.id })
    .then((book) => {
      if (!book) {
        return res.status(404).send({
          message: "Book not found with id " + req.params.id,
        });
      } else if (book.inventory_count === 0) {
        return res.status(404).send({
          message: "Book not available with id " + req.params.id,
        });
      } else {
        // Find If User Already has Borrowed less than 3 Books
        User.findOne({ username: req.params.username }).then((user) => {
          if (!user) {
            return res.status(404).send({
              message: "User not found with username " + req.params.username,
            });
          } else if (user.borrowed_count >= 3) {
            return res.status(404).send({
              message: "User already has 3 books borrowed",
            });
          } else {
            // Update Book and User
            Book.findOneAndUpdate(
              { id: req.params.id },
              { $inc: { inventory_count: -1 } },
              { new: true }
            ).then((book) => {
              User.findOneAndUpdate(
                { username: req.params.username },
                {
                  $push: { borrowed: req.params.id },
                  $inc: { borrowed_count: 1 },
                },
                { new: true }
              ).then((user) => {
                res.send({
                  message: "Book borrowed successfully",
                  book: book,
                  user: user,
                });
              });
            });
          }
        });
      }
    })
    .catch((err) => {
      return res.status(500).send({
        message: err.message || "Some error occurred while borrowing book.",
      });
    });
};

// Delete All Users
exports.deleteAll = (req, res) => {
  User.deleteMany({})
    .then((data) => {
      res.send({ message: `${data.deletedCount} Users deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all users.",
      });
    });
};

exports.return = (req, res) => {
  // Check Path Params
  if (!req.params.username || !req.params.id) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Check if User has borrowed this book
  User.findOne({ username: req.params.username }).then((user) => {
    if (!user) {
      return res.status(404).send({
        message: "User not found with username " + req.params.username,
      });
    } else if (!user.borrowed.includes(req.params.id)) {
      return res.status(404).send({
        message: "User does not have this book borrowed",
      });
    } else {
      // Update Book and User
      Book.findOneAndUpdate(
        { id: req.params.id },
        { $inc: { inventory_count: 1 } },
        { new: true }
      ).then((book) => {
        User.findOneAndUpdate(
          { username: req.params.username },
          {
            $pull: { borrowed: req.params.id },
            $inc: { borrowed_count: -1 },
          },
          { new: true }
        ).then((user) => {
          res.send({
            message: book.title + " returned successfully",
            book: book,
            user: user,
          });
        });
      });
    }
  });
};

exports.getAllBorrowed = (req, res) => {
  User.findOne({ username: req.params.username }).then((user) => {
    if (!user) {
      return res.status(404).send({
        message: "User not found with username " + req.params.username,
      });
    }

    if (user.borrowed_count === 0) {
      return res.status(404).send({
        message: "User does not have any books borrowed",
      });
    } else {
      // Get All Books Borrowed by User and Return The title of the book
      Book.find({ id: { $in: user.borrowed } }).then((books) => {
        res.send({
          message: "Books borrowed by " + req.params.username,
          books: books,
        });
      });
    }
  });
};
