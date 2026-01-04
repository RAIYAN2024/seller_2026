const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { generateToken } = require('../utils/generateToken');
const User = require('../models/User');

const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, phone, address } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    throw new ApiError(400, 'User already exists with this email');
  }

  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
    phone,
    address,
  });

  const token = generateToken(user._id);

  res.status(201).json(
    new ApiResponse(
      201,
      {
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        token,
      },
      'User registered successfully'
    )
  );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  if (!user.isActive) {
    throw new ApiError(401, 'Your account has been deactivated');
  }

  const token = generateToken(user._id);

  res.json(
    new ApiResponse(
      200,
      {
        user: {
          _id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        token,
      },
      'Login successful'
    )
  );
});

const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.json(
    new ApiResponse(
      200,
      { user },
      'Profile retrieved successfully'
    )
  );
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.firstName = req.body.firstName || user.firstName;
  user.lastName = req.body.lastName || user.lastName;
  user.phone = req.body.phone || user.phone;
  user.address = req.body.address || user.address;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.json(
    new ApiResponse(
      200,
      { user: updatedUser },
      'Profile updated successfully'
    )
  );
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};
