import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
    created_At: {
        type: Date,
        default: Date.now
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
    price: {
        type: Number,
        required: [true, "Product price is required."],
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    colors: [
        {
            type: String,
            required: true,
        }
    ],
    rating: {
        type: Number,
        default: null,
        required: false
    },
    products_images: [{
        type: Object,
        required: true,
    }],
    countryOfOrigin: {
        type: String,
        required: false,
        default: "India",
        trim: true
    }
})

const product = mongoose.model('Products', productSchema)
export default product
