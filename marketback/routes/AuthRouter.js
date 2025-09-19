const express = require("express");
const {
  getAllUser,
  addUser,
  getSingleUser,
  updateUser,
  deleteUser,
  logoutAdmin,
  loginAdmin,
} = require("../controller/AuthController"); // Ensure your admin controller has these functions
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require("../middleware/authenticate");

const router = express.Router();

// Route to get all Admin with optional filtering/pagination
router.route("/users").get(getAllUser);

// Route to add a new Admin
router.route("/user").post(addUser);

// Route to get a single Admin by ID
router.route("/user/:id").get(getSingleUser);

// Route to update a Admin by ID
router.route("/user/:id").put(updateUser);

// Route to delete a Admin by ID
router.route("/user/:id").delete(deleteUser);

router.route("/loginuser").post(loginAdmin);

router.route("/logoutuser").post(logoutAdmin);

// Optionally, you can add role-based access control for more security
// Example:
// router.route('/users').get(isAuthenticatedUser, authorizeRoles('admin'), getAllUser);
// router.route('/user').post(isAuthenticatedUser, authorizeRoles('admin'), addUser);

module.exports = router;
