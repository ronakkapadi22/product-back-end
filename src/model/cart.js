import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema({
    created_At: {
        type: Date,
        default: Date.now
    },
    user_id: {
        type: String,
        required: [true, 'User id is required.']
    },
    product_id: {
        type: String,
        required: [true, 'Product id is required.']
    },
    qty: {
        type: Number,
        required: [true, 'Product qty is required.'],
        default: 1
    },
    category: {
        type: String,
        required: [true, 'Product category is required.']
    },
    color: {
        type: String,
        required: [true, 'Product colour is required.']
    }
})

const cart = mongoose.model('Cart', cartSchema)
export default cart
