import mongoose, { Schema } from "mongoose";

export const cartProductSchema = new Schema({
    product_id: {
        type: String,
        required: [true, 'Product id is required.']
    },
    product_name: {
        type: String,
        required: [true, "Product name is required."],
        trim: true
    },
    product_image: {
        type: String,
        required: true,
        default: null,
        trim: true
    },
    product_description: {
        type: String,
        required: [true, "Product description is required."],
        minlength: 100,
        trim: true
    },
    qty: {
        type: Number,
        required: [true, 'Product qty is required.'],
        default: 1
    },
    price: {
        type: Number,
        required: [true, "Product price is required."],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Product category is required.']
    },
    color: {
        type: String,
        required: [true, 'Product colour is required.']
    },
    countryOfOrigin: {
        type: String,
        required: false,
        default: "India",
        trim: true
    }
})

export const cartSchema = new Schema({
    created_At: {
        type: Date,
        default: Date.now
    },
    user_id: {
        type: String,
        required: [true, 'User id is required.']
    },
    cart_data: [cartProductSchema],
})

const cart = mongoose.model('Cart', cartSchema)
export default cart
