const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const register = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400)("Username and password are required.");
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({message:"Username already in use."});
    }

    const user = await User.create({
      username,
      password
    });

    const token = generateJwtToken(user);

    res.status(201).json({
      user: {
        id: user._id,
        username: user.username
      },
      token
    });
  } catch (error) {
    next(error);
  }
}

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = generateJwtToken(user);

    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username
      },
      token
    });

  } catch (error) {
    next(error);
  }
}

const validateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({message:"Token not provided."});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({message:"User not found."});
    }

    res.status(200).json({ 
      valid: true, 
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    next(res.status(401).json({message:"Invalid or expired token."}));
  }
}


function generateJwtToken(user) {
  return jwt.sign(
    { 
      userId: user._id, 
      username: user.username 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}

module.exports = {
  register,
  login,
  validateToken
};