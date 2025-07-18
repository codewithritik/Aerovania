const User = require('../models/User');
const { generateTokens } = require('../utils/jwt');
const { registerSchema, loginSchema, updateProfileSchema, changePasswordSchema } = require('../utils/validation');

class AuthController {
  static async register(req, res) {
    try {
      const { error, value } = registerSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { username, email, password, role } = value;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'User with this email already exists' });
      }

      // Create new user
      const newUser = await User.create({ username, email, password, role });
      
      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(newUser.id, newUser.email, newUser.role);

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role
        },
        tokens: {
          accessToken,
          refreshToken
        }
      });

    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.code === '23505') { // Unique constraint violation
        return res.status(409).json({ error: 'Username or email already exists' });
      }
      
      res.status(500).json({ error: 'Failed to register user' });
    }
  }

  static async login(req, res) {
    try {
      const { error, value } = loginSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { email, password } = value;

      // Find user by email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Verify password
      const isValidPassword = await User.verifyPassword(password, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Update last login
      await User.updateLastLogin(user.id);

      // Generate tokens
      const { accessToken, refreshToken } = generateTokens(user.id, user.email, user.role);

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          lastLogin: user.last_login
        },
        tokens: {
          accessToken,
          refreshToken
        }
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Failed to login' });
    }
  }

  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token required' });
      }

      const { verifyToken } = require('../utils/jwt');
      const decoded = verifyToken(refreshToken);

      // Find user
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ error: 'Invalid refresh token' });
      }

      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id, user.email, user.role);

      res.json({
        tokens: {
          accessToken,
          refreshToken: newRefreshToken
        }
      });

    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(401).json({ error: 'Invalid refresh token' });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          createdAt: user.created_at,
          lastLogin: user.last_login
        }
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ error: 'Failed to get profile' });
    }
  }

  static async updateProfile(req, res) {
    try {
      const { error, value } = updateProfileSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const updatedUser = await User.updateProfile(req.user.id, value);

      res.json({
        message: 'Profile updated successfully',
        user: updatedUser
      });

    } catch (error) {
      console.error('Update profile error:', error);
      
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Username or email already exists' });
      }
      
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }

  static async changePassword(req, res) {
    try {
      const { error, value } = changePasswordSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const { currentPassword, newPassword } = value;

      // Get user with password hash
      const user = await User.findByEmail(req.user.email);
      
      // Verify current password
      const isValidPassword = await User.verifyPassword(currentPassword, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      // Update password
      await User.changePassword(req.user.id, newPassword);

      res.json({
        message: 'Password changed successfully'
      });

    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ error: 'Failed to change password' });
    }
  }

  static async logout(req, res) {
    // Since we're using stateless JWT, logout is handled client-side
    // In a production app, you might want to implement token blacklisting
    res.json({ message: 'Logged out successfully' });
  }
}

module.exports = AuthController;
