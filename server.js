// TO CHANGE THE DB URL GO TO THE FOLDER APP/CONFIG/DB.CONFIG.JS
const express = require("express");
const path = require("path");

// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");

const app = express();

const ejs = require("ejs");
app.set("views", path.join(__dirname, "app/views"));
// set the view engine to ejs
app.set("view engine", "ejs");

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(
  express.urlencoded({ extended: true })
); /* bodyParser.urlencoded() is deprecated */

const db = require("./app/models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Pizza Application." });
});

require("./app/routes/pizza.routes")(app);

const Pizza = db.pizza;
app.get("/pizzaqueue", (req, res) => {
  var queues = [];
  Pizza.find()
    .then((pizzas) => {
      // Date Now minus Created Pizza is more than 1 minute
      const dateNow = new Date();
      pizzas.forEach((element) => {
        var pizza = {};
        const dateCreated = new Date(element.createdAt);
        // Difference in seconds
        const diff = Math.abs(dateNow.getTime() - dateCreated.getTime()) / 1000;
        console.log(diff);
        if (diff >= 60) {
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
    // Render Views
    .then(() => {
      res.render("queues.ejs", {
        pizza: queues,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while getting the Pizzas.",
      });
    });
});

// set port, listen for requests
const PORT = process.env.PORT || 8889;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
