const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

// this imports bookSchema from book.js
const bookSchema = require('./Book');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    // make savedBooks inot array of data that follows the bookSchema
    savedBooks: [bookSchema],
  },

  {
    toJSON: {
      virtuals: true,
    },
  }
);

// this will hash a user password.
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// custom method used to authenticate the user and the correct password.
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// this will query a user and then add another field as bookCount to the number of saved books.
userSchema.virtual('bookCount').get(function () {
  return this.savedBooks.length;
});

const User = model('User', userSchema);

module.exports = User;
