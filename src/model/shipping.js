import mongoose, { Schema } from "mongoose";


export const shipping_address = {
    address_line_1: {
        type: String,
        required: [true, 'Address is required.'],
        trim: true,
        maxLength: 150
    },
    address_line_2: {
        type: String,
        required: false,
        trim: true,
        maxLength: 50
    },
    city: {
        type: String,
        trim: true,
        required: [true, 'City name is required.']
    },
    state: {
        type: String,
        trim: true,
        required: [true, 'State name is required.']
    },
    pin_code: {
        type: Number,
        trim: true,
        minLength: 6,
        maxLength: 8,
        required: [true, 'Postal code is required.']
    }
}

export const addressSchema = new Schema({
    create_At: {
        type: Date,
        default: Date.now
    },
    user_id: {
        type: String,
        required: [true, 'User id is required.']
    },
    shipping_name: {
        type: String,
        required: [true, 'Shipping name is required.'],
        trim: true
    },
    contact_number: {
        type: String,
        required: [true, 'Contact number is required.'],
        trim: true,
        maxLength: 18
    },
    country: {
        type: String,
        required: [true, 'Country name is required.'],
        trim: true
    },
    shipping_address,
    area: {
        type: String,
        required: false
    },
    landmark:{
        type: String,
        required: [true, 'Landmark is required.'],
        maxLength: 25,
        trim: true
    },
    type_of_address: {
        type: String,
        required: true,
        default: "Home",
        trim: true
    },
    isDefaultShipping: {
        type: Boolean,
        required: false,
        default: false
    }
})

const shippingAddress = mongoose.model('Shipping Address', addressSchema)
export default shippingAddress