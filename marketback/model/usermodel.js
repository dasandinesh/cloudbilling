const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter a valid email"],
    unique: true,
  },

  phone: {
    type: Number,
    required: [true, "Please enter a password"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
  },
  role: {
    type: String,
    default: "user",
  },
  active: {
    type: String,
    default: "active",
  },
  domin: {
    type: String,
  },

  qualification: {
    type: String,
  },
  resetPasswordToken: {
    type: String,
  },
  area: {
    type: String,
  },
  bus_route: {
    type: String,
  },
  resetPasswordTokenExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Method to generate JWT token
userSchema.methods.getJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role }, // Include role in JWT
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Method to compare entered password with hashed password
userSchema.methods.isValidPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
    