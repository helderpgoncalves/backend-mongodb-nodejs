module.exports = (app) => {
  const books = require("../controllers/books.controller.js");

  var router = require("express").Router();

  // Create a new Book
  router.post("/", books.create);

  // Get All Books
  router.get("/", books.findAll);

  router.put("/:id", books.update);

  router.put("/:id", books.updateInventory);

  // Edit a Book
  router.put("/:id", books.update);

  // Delete a Book
  router.delete("/:id", books.delete);

  // Delete all Books
  router.delete("/", books.deleteAll);

  // Get a single Book by id
  router.get("/:id", books.findOne);

  app.use("/book", router);
};
