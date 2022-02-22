const { Mongoose } = require("mongoose");

module.exports = (mongoose) => {
  var schema = mongoose.Schema({
    id: {
      type: Number,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
    },
    inventory_count: {
      type: Number,
      required: true,
      min: 0,
    },
  });
  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object._id = _id;
    return object;
  });

  const Book = mongoose.model("book", schema);
  return Book;
};
