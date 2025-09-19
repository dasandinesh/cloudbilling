const APIFeatures = require("../utils/apiFeatures");
const User = require("../model/usermodel");
const jwt = require("jsonwebtoken");
const { sendToken } = require("../utils/jwt");


// Add a new admin
exports.addUser = async (req, res) => {
  try {
    console.log("User added successfully");
    const user = await User.create(req.body);
    res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get a single admin by ID
exports.getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all admins with search, filter, and pagination
exports.getAllUser = async (req, res) => {
  try {
    const apiFeatures = new APIFeatures(
      User.find().populate("member_list.member_id", "name phone"),
      req.query
    )
      .search()
      .filter()
      .paginate();

    const users = await apiFeatures.query;

    const userFilter = users.map((user) => ({
      ...user._doc,
      members: user.member_list.map((member) => ({
        name: member.member_id ? member.member_id.name : "Unknown",
        phone: member.member_id ? member.member_id.phone : "N/A",
      })),
    }));

    res.status(200).json({ success: true, user: userFilter });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update an admin by ID
exports.updateUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete an admin by ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await User.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Login admin
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter email and password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.isValidPassword(password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    sendToken(user, 200, res);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Logout admin
exports.logoutAdmin = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true, // Set to true if using HTTPS
    sameSite: "None", // Important for cross-origin cookies
    expires: new Date(0), // Expire immediately
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
};
