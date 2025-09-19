const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const Admin = require("../model/usermodel");



exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  // Check for token in cookies first, then in Authorization header
  let token = req.cookies.token;
  
  // If no token in cookies, check Authorization header
  if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return next(new ErrorHandler("Please log in first", 401)); // 401 Unauthorized
  }

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Find user by decoded token id
  req.user = await Admin.findById(decoded.id);

  // Proceed to next middleware
  next();
});

// Check if user is authorized for specific roles
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Check if user role is authorized
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`Role ${req.user.role} is not authorized`, 403)
      ); // 403 Forbidden
    }
    // Proceed if authorized
    next();
  };
};
