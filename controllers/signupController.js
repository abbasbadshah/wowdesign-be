const bcrypt = require('bcryptjs');
const userValidator = require('../validators/userValidator');
const db = require('../config/database');

exports.signup = async (req, res) => {
  try {
    // Validate request body
    const { error } = userValidator.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { username, email, password, role } = req.body;

    // Check if user already exists
    db.query('SELECT * FROM signup WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error('Error querying the database:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      if (results.length > 0) return res.status(400).json({ message: 'User already exists' });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert new user into database
      const createdDate = new Date().toISOString();
      db.query(
        'INSERT INTO signup (username, email, password, confirm_password, role, created_date) VALUES (?, ?, ?, ?, ?, ?)',
        [username, email, hashedPassword, hashedPassword, role || 'user', createdDate],
        (err, result) => {
          if (err) {
            console.error('Error inserting user into database:', err);
            return res.status(500).json({ message: 'Server error' });
          }

          // Respond with the created user
          const newUser = {
            id: result.insertId,
            username,
            email,
            password: hashedPassword,
            confirm_password: hashedPassword,
            role: role || 'user',
            created_date: createdDate,
          };
          res.status(201).json({ message: 'User registered successfully', user: newUser });
        }
      );
    });
  } catch (err) {
    console.error('Error in signup controller:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
