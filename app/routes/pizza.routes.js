module.exports = (app) => {
  const pizzas = require("../controllers/pizzas.controller.js");

  var router = require("express").Router();

  // Create a new Pizza
  router.post("/", pizzas.create);

  // Get All Pizzas
  router.get("/", pizzas.findAll);

  // Get a single Pizza by id
  router.get("/:id", pizzas.findOne);

  // Delete All
  router.delete("/", pizzas.deleteAll);

  // Update a Pizza by id
  router.put("/:id", pizzas.update);

  // Delete a Pizza with id
  router.delete("/:id", pizzas.delete);

  app.use("/pizza", router);
};
