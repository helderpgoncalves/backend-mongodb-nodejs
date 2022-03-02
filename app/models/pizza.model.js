const { Mongoose } = require("mongoose");

module.exports = (mongoose) => {
  var schema = mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      sauce: {
        type: String,
        required: true,
        enum: ["chilli", "medium", "normal"],
      },
      vegetable: {
        type: String,
        required: true,
        enum: ["onion", "pepper", "mushroom", "spinach"],
      },
      meat: {
        type: String,
        required: false,
        default: null,
        enum: [null, "beef", "pepperoni"],
      },
    },
    { timestamps: true }
  );

  const Pizza = mongoose.model("pizza", schema);
  return Pizza;
};
