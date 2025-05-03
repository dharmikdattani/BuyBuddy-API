const Joi  = require('joi')

const registerSchema = Joi.object({
    Firstname: Joi.string().required().messages({
        "string.empty": "First name is required",
        "any.required": "First name is required",
    }),
    Lastname: Joi.string().required().messages({
        "string.empty": "Last name is required",
        "any.required": "Last name is required",
    }),
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
        "string.empty": "Password is required",
        "any.required": "Password is required",
    }),
    Address: Joi.string().required().messages({
        "string.empty": "Address is required",
        "any.required": "Address is required",
    }),
})

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
        "string.empty": "Password is required",
        "any.required": "Password is required",
    }),
})

const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required().messages({
        "string.empty": "Refresh token is required",
        "any.required": "Refresh token is required",
    }),
})

const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "any.required": "Email is required",
    }),
})

module.exports = { registerSchema, loginSchema, refreshTokenSchema, forgotPasswordSchema };
