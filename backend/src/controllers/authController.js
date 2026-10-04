import bcrypt from 'bcryptjs';
import { db } from '../config/db.js';
import { generateToken } from '../config/jwt.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const existing = db.findOne('users', u => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = db.insert('users', {
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      currency: 'INR',
      role: 'user',
    });

    const token = generateToken({ id: newUser.id, email: newUser.email });
    const { password: _, ...userSafe } = newUser;

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: userSafe,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    const user = db.findOne('users', u => u.email.toLowerCase() === normalizedEmail);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken({ id: user.id, email: user.email });
    const { password: _, ...userSafe } = user;

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: userSafe,
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, currency, currentPassword, newPassword } = req.body;
    const user = db.findById('users', req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    const updates = {};
    if (name) updates.name = name.trim();
    if (currency) updates.currency = currency;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Current password is required to set a new password.' });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
      }
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(newPassword, salt);
    }

    const updatedUser = db.updateById('users', user.id, updates);
    const { password: _, ...userSafe } = updatedUser;

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: userSafe,
    });
  } catch (err) {
    next(err);
  }
};
