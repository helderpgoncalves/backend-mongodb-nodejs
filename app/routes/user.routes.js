module.exports = (app) => {
  const users = require("../controllers/users.controller.js");

  var router = require("express").Router();

  // Create a new User
  router.post("/", users.create);

  // Get All Users
  router.get("/", users.findAll);

  // Edit a User
  router.put("/:username", users.update);

  // Delete a User
  router.delete("/:username", users.delete);

  // Get a single User by username
  router.get("/:username", users.findOne);

  router.post("/:username/borrows/:id", users.borrow);

  // Delete all Users
  router.delete("/", users.deleteAll);

  // Return a Book by id
  router.post("/:username/returns/:id", users.return);

  router.get("/:username/borrowed", users.getAllBorrowed);

  app.use("/user", router);
};
