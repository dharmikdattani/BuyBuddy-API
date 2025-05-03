const Joi = require('joi')

const productSchema = Joi.object({
    title: Joi.string().required().messages({
        "string.empty": "Product title is required",
        "any.required": "Product title is required",
    }),
    content: Joi.string().required().messages({
        "string.empty": "Product description is required",
        "any.required": "Product description is required",
    }),
    price: Joi.number().required().messages({
        "string.empty": "Product price is required",
        "any.required": "Product price is required",
    }),
    quantity: Joi.number().required().messages({
        "string.empty": "Product quantity is required",
        "any.required": "Product quantity is required",
    }),
    category: Joi.string().required().messages({
        "string.empty": "Product category is required",
        "any.required": "Product category is required",
    }),
    subCategory: Joi.string().required().messages({
        "string.empty": "Product subCategory is required",
        "any.required": "Product subCategory is required",
    }),
})

const categorySchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "Category name is required",
        "any.required": "Category name is required",
    }),
})

const subCategorySchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "SubCategory name is required",
        "any.required": "SubCategory name is required",
    }),
    category: Joi.string().required().messages({
        "string.empty": "Category ID is required",
        "any.required": "Category ID is required",
    }),
})

module.exports = { productSchema, categorySchema, subCategorySchema };
