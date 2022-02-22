module.exports = (mongoose) => {
  var schema = mongoose.Schema({
    username: String,
    // Format 123-456-7890
    phone: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\d{3}-\d{3}-\d{4}$/.test(v);
        },
        message: "{VALUE} is not a valid phone number!",
      },
    },
    borrowed: [{ type: Number, ref: "Book" }],
    borrowed_count: {
      type: Number,
      default: 0,
    },
  });
  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const User = mongoose.model("user", schema);
  return User;
};
