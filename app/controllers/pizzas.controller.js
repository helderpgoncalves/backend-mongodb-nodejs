const db = require("../models");
const Pizza = db.pizza;

// Get all Pizzas
exports.findAll = (req, res) => {
  Pizza.find()
    .then((pizzas) => {
      res.send(pizzas);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while getting the Pizzas.",
      });
    });
};

// Get a single Pizza by id
exports.findOne = (req, res) => {
  Pizza.findById(req.params.id)
    .then((pizza) => {
      if (!pizza) {
        return res.status(404).send({
          message: "Pizza not found with id " + req.params.id,
        });
      }
      res.send(pizza);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Pizza not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Error retrieving Pizza with id " + req.params.id,
      });
    });
};

// Create and Save a new Pizza
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    return res.status(400).send({
      message: "Pizza name can not be empty",
    });
  }

  // Dont create Pizzas with same name
  Pizza.findOne({ name: req.body.name }).then((pizza) => {
    if (pizza) {
      return res.status(400).send({
        message: "Pizza already exists with name " + req.body.name,
      });
    }
  });

  if (!req.body.sauce) {
    return res.status(400).send({
      message: "Pizza sauce can not be empty",
    });
  }

  if (!req.body.vegetable) {
    return res.status(400).send({
      message: "Pizza vegetable can not be empty",
    });
  }

  var meat = req.body.meat;
  if (!meat) {
    meat = null;
  }

  // Create a Pizza
  const pizza = new Pizza({
    name: req.body.name,
    sauce: req.body.sauce,
    vegetable: req.body.vegetable,
    meat: req.body.meat,
  });

  // Save Pizza in the database
  pizza
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Pizza.",
      });
    });
};

// Delete a Pizza by id
exports.delete = (req, res) => {
  Pizza.findByIdAndRemove(req.params.id)
    .then((pizza) => {
      if (!pizza) {
        return res.status(404).send({
          message: "Pizza not found with id " + req.params.id,
        });
      }
      res.send({ message: "Pizza deleted successfully!" });
    })
    .catch((err) => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Pizza not found with id " + req.params.id,
        });
      }
      return res.status(500).send({
        message: "Could not delete Pizza with id " + req.params.id,
      });
    });
};

// Update Pizza by id
exports.update = (req, res) => {
  // Get the Pizza
  Pizza.findById(req.params.id)
    .then((pizza) => {
      if (!pizza) {
        return res.status(404).send({
          message: "Pizza not found with id " + req.params.id,
        });
      }

      // Update the Pizza
      pizza.name = req.body.name;
      pizza.sauce = req.body.sauce;
      pizza.vegetable = req.body.vegetable;
      pizza.meat = req.body.meat;

      if (!pizza.name) {
        // Set the same name as before
        pizza.name = pizza.name;
      }

      if (!pizza.sauce) {
        // Set the same sauce as before
        pizza.sauce = pizza.sauce;
      }

      if (!pizza.vegetable) {
        // Set the same vegetable as before
        pizza.vegetable = pizza.vegetable;
      }

      if (!pizza.meat) {
        // Set the same meat as before
        pizza.meat = pizza.meat;
      }

      // Save the Pizza
      pizza
        .save()
        .then((data) => {
          res.send(data);
        })
        .catch((err) => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while updating the Pizza.",
          });
        });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving the Pizza.",
      });
    });
};

// Delete all Pizzas
exports.deleteAll = (req, res) => {
  Pizza.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Pizzas were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Pizzas.",
      });
    });
};

// Render Queues Pizza
exports.renderQueues = (req, res) => {
  var queues = [];
  Pizza.find()
    .then((pizzas) => {
      // Date Now minus Created Pizza is more than 1 minute
      const dateNow = new Date();
      pizzas.forEach((element) => {
        var pizza = {};
        const dateCreated = new Date(element.created);
        const diff = dateNow - dateCreated;
        if (diff > 60000) {
          pizza.state = "Ready";
          pizza.name = element.name;
          pizza.sauce = element.sauce;
          pizza.vegetable = element.vegetable;
          pizza.meat = element.meat;
          queues.push(pizza);
        } else {
          pizza.state = "In Preparation";
          pizza.name = element.name;
          pizza.sauce = element.sauce;
          pizza.vegetable = element.vegetable;
          pizza.meat = element.meat;
          queues.push(pizza);
        }
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while getting the Pizzas.",
      });
    });
};
