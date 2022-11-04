import mongoose, { Schema } from 'mongoose'

export const userSchema = new Schema({
    created_At: {
        type: Date,
        default: Date.now
    },
    username: {
        type : String,
        required: true,
        trim: true 
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    role: {
        type: String,
        trim: true,
        default: 'user'
    },
    contact: {
        type: Number,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8
    }
})

const user = mongoose.model('Users', userSchema)
export default user