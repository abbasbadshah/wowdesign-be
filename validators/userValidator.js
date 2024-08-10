const Joi = require('joi');

const userSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirm_password: Joi.any().equal(Joi.ref('password')).required()
    .messages({ 'any.only': 'Passwords do not match' }),
  role: Joi.string().optional()
});

module.exports = userSchema;
