const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    db.query('SELECT * FROM signup WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error('Error querying the database:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      if (results.length === 0) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Check password
      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Create and sign JWT
      const payload = {
        user: {
          id: user.id
        }
      };
      jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' }, (err, token) => {
        if (err) {
          console.error('Error generating JWT:', err);
          return res.status(500).json({ message: 'Server error' });
        }
        res.json({ token });
      });
    });
  } catch (err) {
    console.error('Error in login controller:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
