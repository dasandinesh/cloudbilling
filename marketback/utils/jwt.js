const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  // Use expires instead of maxAge to avoid compatibility issues
  const days = 7; // Fixed 7 days
  const expiryDate = new Date(Date.now() + (days * 24 * 60 * 60 * 1000));
  
  // console.log('Setting cookie with expiry:', expiryDate);

  const options = {
    expires: expiryDate,
    httpOnly: false,
    sameSite: 'lax',
    secure: false,
    path: '/'
  };

  res.cookie('token', token, options);

  // Avoid sending sensitive fields
  const safeUser =
    (typeof user.toObject === 'function' ? user.toObject() : user);
  delete safeUser.password;

  res.status(statusCode).json({ success: true, user: safeUser, token: token });
};
module.exports = { sendToken };
