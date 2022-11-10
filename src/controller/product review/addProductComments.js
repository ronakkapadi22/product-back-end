import { serverError } from "../../helpers/errors.js"
import { allFieldsRequired, isTokenExpired, isValidObjectId, verifyUserToken } from "../../helpers/index.js"
import productReview from "../../model/product_review.js"
import user from "../../model/user.js"

export const addProductComments = async (req, res, next) => {
    try {

        const { token } = req.headers
        const { id } = req.params
        const { product_id, review } = req.body
        const { product_images } = req.files
        const { comment, rating } = review

        if (!token) return res.status(401).json({
            type: "error",
            message: "No token provided."
        })

        const isExpiredToken = await isTokenExpired(res, token)
        if (isExpiredToken) return res.status(401).json({
            type: "error",
            message: "Invalid token, please try again later."
        })

        if (!isValidObjectId(id)) return res.status(401).json({
            type: "error",
            message: "Please enter a valid id."
        })

        const isAllFieldRequired = allFieldsRequired([product_id, rating])
        if (isAllFieldRequired) return res.status(400).json({
            type: "error",
            message: "All fields are required."
        })

        const verifiedUser = await verifyUserToken(token)
        const findUser = await user.findById(verifiedUser?.user_id)
        if (verifiedUser?.role !== 'admin' && findUser?._id.toString() !== id) return res.status(401).json({
            type: "error",
            message: "Unauthorized user."
        })

        const data = new productReview({
            user_id: id,
            product_id,
            review: {
                rating,
                comment,
                product_images: product_images?.map(val => { return { image_url: val?.location } }),
            }
        })

        const reviewData = await data.save()

    } catch (error) {
        return serverError(error, res)
    }
}