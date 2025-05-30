const Joi = require('joi');

const validatCredentials = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(/^(?=.*[A-Za-z])(?=.*\d)/).required(),
  firstName: Joi.string().alphanum().min(3).max(20).required()
});

module.exports = validatCredentials;

