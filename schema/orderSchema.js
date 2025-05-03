import joi from "joi";

const orderSchema = joi.object({
    orderItems: joi.array().items(
        joi.object({
            quantity: joi.number().required().messages({
                "string.empty": "Product quantity is required",
                "any.required": "Product quantity is required",
            }),
            product: joi.string().required().messages({
                "string.empty": "Product ID is required",
                "any.required": "Product ID is required",
            }),
        })
    ),
    shippingAddress: joi.string().required().messages({
        "string.empty": "Shipping address is required",
        "any.required": "Shipping address is required",
    }),
    city: joi.string().required().messages({
        "string.empty": "City is required",
        "any.required": "City is required",
    }),
    country: joi.string().required().messages({
        "string.empty": "Country is required",
        "any.required": "Country is required",
    }),
    code: joi.string().required().messages({
        "string.empty": "Postal code is required",
        "any.required": "Postal code is required",
    }),
    phone: joi.string().required().messages({
        "string.empty": "Phone number is required",
        "any.required": "Phone number is required",
    }),
    status: joi.string().required().messages({
        "string.empty": "Order status is required",
        "any.required": "Order status is required",
    }),
    paymentMethod: joi.string().valid("COD", "UPI", "Card").required().messages({
        "any.only": "Payment method must be one of COD, UPI, or Card",
        "any.required": "Payment method is required",
    }),
    totalPrice: joi.number().required().messages({
        "string.empty": "Total price is required",
        "any.required": "Total price is required",
    }),
    user: joi.string().required().messages({
        "string.empty": "User ID is required",
        "any.required": "User ID is required",
    }),
})

export default orderSchema