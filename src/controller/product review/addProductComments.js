import { serverError } from "../../helpers/errors.js"
import { allFieldsRequired, isTokenExpired, isValidObjectId, verifyUserToken } from "../../helpers/index.js"
import product from "../../model/product.js"
import productReview from "../../model/product_review.js"
import user from "../../model/user.js"

export const addProductComments = async (req, res, next) => {
    try {

        const { token } = req.headers
        const { id } = req.params
        const { product_id, review } = req.body

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

        const isAllFieldRequired = allFieldsRequired([product_id, review?.rating])
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
                rating : review?.rating,
                comment : req.body?.comment ? req.body?.comment : null,
                product_images: req.files?.product_images ?  req.files?.product_images?.map(val => { return { image_url: val?.location } }) : null
            }
        })

        const reviewData = await data.save()
        const reviews = await productReview.find({product_id})

        if(reviewData){
            const product_rates = reviews?.map(val => val?.review?.rating)
            const rate = product_rates?.reduce((data, value) => data + value, 0) / product_rates?.length
            await product.findByIdAndUpdate(product_id, {rating: rate?.toFixed(1)})
        }

        return res.status(201).json({
            type: "success",
            data: reviewData
        })

    } catch (error) {
        return serverError(error, res)
    }
}