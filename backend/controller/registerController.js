import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword
    });

    const savedUser = await newUser.save();
    
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    const token = jwt.sign(
      { id: savedUser._id, role: savedUser.role },
      process.env.JWT_SECRET || 'secret_key_fallback',
      { expiresIn: '1d' }
    );

    res.status(201).json({ user: userResponse, token });
  } catch (err) {
    console.error(err);

    if (err?.code === 11000) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    res.status(500).json({ message: 'Server error' });
  }
};
