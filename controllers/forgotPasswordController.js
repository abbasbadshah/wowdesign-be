const crypto = require('crypto');
const nodemailer = require('nodemailer');
const db = require('../config/database');

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Generate token
    const token = crypto.randomBytes(20).toString('hex');

    // Store token in the database
    db.query('UPDATE users SET reset_password_token = ?, reset_password_expires = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE email = ?', [token, email], (err, result) => {
      if (err) {
        console.error('Error updating database:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      // Send email with token
      const transporter = nodemailer.createTransport({
        // Configure SMTP settings for your email service provider
      });
      
      const mailOptions = {
        from: 'your_email@example.com',
        to: email,
        subject: 'Password Reset',
        text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n`
          + `Please click on the following link, or paste this into your browser to complete the process:\n\n`
          + `http://localhost:3001/api/auth/reset-password?token=${token}\n\n`
          + `If you did not request this, please ignore this email and your password will remain unchanged.\n`
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error('Error sending email:', err);
          return res.status(500).json({ message: 'Server error' });
        }
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Email sent' });
      });
    });
  } catch (err) {
    console.error('Error in forgot password controller:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
