import request from 'request'
import dotenv from 'dotenv'
dotenv.config()
import { serverError } from "../../helpers/errors.js"
import { allFieldsRequired, isTokenExpired, verifyUserToken } from "../../helpers/index.js"
import user from "../../model/user.js"

export const createCheckoutPaymentSession = async (req, res) => {
    try {

        const { id } = req.params
        const { token } = req.headers
        const { intent_id, payment, currency } = req.body

        if (!token) return res.status(401).json({
            type: "error",
            message: "No token provided."
        })

        const isExpiredToken = await isTokenExpired(res, token)
        if (isExpiredToken) return res.status(401).json({
            type: "error",
            message: "Invalid token, please try again later."
        })

        const isAllFieldRequired = allFieldsRequired([intent_id, payment, currency])
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

        request.post(`https://${env.process.RAZORPAY_KEY_ID}:${env.process.RAZORPAY_SK}@api.razorpay.com/v1/payments/${intent_id}/capture`, {
            form: {
                amount: payment, // amount == Rs 10 // Same As Order amount
                currency,
            }
        }, (err, response, body) => {
            if (err) {
                return res.status(500).json({
                    type: "error",
                    message: err?.message || "Somthing went wrong."
                });
            }
            console.log("Status:", response.statusCode);
            console.log("Headers:", JSON.stringify(response.headers));
            console.log("Response:", body);
            return res.status(200).json(body);
        })

    } catch (error) {
        return serverError(error, res)
    }
}