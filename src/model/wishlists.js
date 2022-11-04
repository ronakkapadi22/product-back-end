import mongoose, { Schema } from "mongoose";

export const productAddedInWishListsSchema = new Schema({
    product_id:{
        type: String,
        required: [true, 'Product id is required.']
    }
})

export const wishListsSchema = new Schema({
    create_At: {
        type: Date,
        default: Date.now
    },
    user_id: {
        type: String,
        trim: true,
        required: [true, 'User id is required.']
    },
    wish_lists: [productAddedInWishListsSchema]
})

const wishLists = mongoose.model('wishlists', wishListsSchema)
export default wishLists