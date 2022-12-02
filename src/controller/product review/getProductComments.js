import { isValidObjectId } from "../../helpers/index.js"
import { serverError } from "../../helpers/errors.js"
import productReview from "../../model/product_review.js"

export const getProductComments = async(req, res) => {
    try {

        const { id } = req.params

        if (!isValidObjectId(id)) return res.status(401).json({
            type: "error",
            message: "Please enter a valid id."
        })

        const results = await productReview.aggregate([
            {
                "$match": {
                    "product_id": id
                }
            },
            {
                "$addFields": {
                    "product_id": { $toObjectId: "$product_id" }
                }
            },
            {
                "$lookup" : {
                    "from": "products",
                    "localField": "product_id",
                    "foreignField": "_id",
                    "as": "result"
                }
            },
            {
                "$unwind": "$result"
            },
            {
                "$addFields": {
                    "user_id": { $toObjectId: "$user_id" }
                }
            },
            {
                "$lookup" : {
                    "from": "users",
                    "localField": "user_id",
                    "foreignField": "_id",
                    "as": "user"
                }
            },
            {
                "$unwind": "$user"
            },
            {
                "$project": {
                    _id: 1,
                    product_id: 1,
                    username: "$user.username",
                    profile: "$user.profile_url",
                    review: {
                        rating: "$review.rating",
                        comment: "$review.comment",
                        review_images: "$review.product_images"
                    }
                }
            }
        ])

        return res.status(200).json({
            type: "success",
            data: results
        })

    } catch (error) {
        return serverError(error, res)
    }
}