// import Stripe from 'stripe'
import Razorpay from 'razorpay'
import * as dotenv from 'dotenv'
dotenv.config()
import { serverError } from "../../helpers/errors.js"
import { allFieldsRequired, isTokenExpired, verifyUserToken } from '../../helpers/index.js'
import cart from '../../model/cart.js'
import user from '../../model/user.js'

// const stripe = new Stripe(process.env.STRIPE_MARUTI_SK)

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SK
});

export const createCheckoutSessionForUser = async (req, res, next) => {

    const { token } = req.headers
    const { cart_items } = req.body
    const { id } = req.params

    try {

        if (!token) return res.status(401).json({
            type: "error",
            message: "No token provided."
        })

        const isExpiredToken = await isTokenExpired(res, token)
        if (isExpiredToken) return res.status(401).json({
            type: "error",
            message: "Invalid token, please try again later."
        })

        const isAllFieldRequired = allFieldsRequired(cart_items, true)
        if (isAllFieldRequired) return res.status(400).json({
            type: "error",
            message: "All fields are required."
        })

        const verifiedUser = await verifyUserToken(token)
        const findUser = await user.findById(verifiedUser?.user_id)

        if (findUser?._id.toString() !== id) return res.status(401).json({
            type: "error",
            message: "Unauthorized user."
        })

        const getAllocateCartData = await cart.findOne({ user_id: id })

        if (!getAllocateCartData) return res.status(404).json({
            type: "error",
            message: "Cart not found for user."
        })

        const { cart_data } = getAllocateCartData

        const newData = cart_data.map((value, index) => {
            if (value?._id?.toString() === cart_items[index]) {
                return true
            } else return false
        })

        const isAllProductExist = newData.every(value => value === true)

        if (!isAllProductExist) return res.status(200).json({
            type: "error",
            message: 'Invalid cart items.'
        })

        // const line_items = cart_data.map((value) => {
        //     return {
        //         price_data: {
        //             currency: "inr",
        //             product_data: {
        //                 name: value.product_name,
        //                 description: value.product_description,
        //                 images: [value.product_image]
        //             },
        //             unit_amount: (value.price * 100)
        //         },
        //         quantity: value.qty
        //     }
        // })

        // console.log('line_items', line_items)

        const total_amount = cart_data?.reduce((data, iccumlator) => (data.qty * data.price) + (iccumlator.qty * iccumlator.price))

        // const session = await stripe.checkout.sessions.create({
        //     line_items,
        //     mode: 'payment',
        //     payment_method_types: ['card'],
        //     success_url: `${process.env.HOST_URL}?success=true`,
        //     cancel_url: `${process.env.HOST_URL}?canceled=true`,
        // })

        const createPaymentIntent = await instance.orders.create({
            amount: total_amount * 100,
            currency: "INR",
            receipt: "receipt#1",
            payment_capture: true,
            notes: {
                orderType: "Pre"
            }
        }, async(err, order) => {
            if(err) return res.status(401).json({
                type: "error",
                message: err?.message || err
            })
            return res.status(201).json({
                type: "success",
                data: order
            })
        }) 

    } catch (error) {
        return serverError(error, res)
    }
}