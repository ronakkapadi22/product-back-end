import mongoose, { Schema } from "mongoose";

export const productReviewImagesSchema = new Schema({
    image_url: {
        type: String,
        required: false,
        trim: true,
        default: null
    }
})

export const productReviewSchema = new Schema({
    created_At: {
        type: Date,
        default: Date.now
    },
    user_id: {
        type: String,
        required: [true, 'User id is required.'],
        trim: true
    },
    product_id: {
        type: String,
        required: [true, 'Product id is required.'],
        trim: true
    },
    review: {
        rating: {
            type: Number,
            required: [true, 'Rating is required.'],
            trim: true,
            maxLength: 5
        },
        comment: {
            type: String,
            required: false,
            trim: true
        },
        product_images: [productReviewImagesSchema]
    }
})

const productReview = mongoose.model('reviews', productReviewSchema)
export default productReview