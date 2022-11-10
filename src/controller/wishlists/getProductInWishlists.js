import { serverError } from "../../helpers/errors.js"
import { isTokenExpired, isValidObjectId, verifyUserToken } from "../../helpers/index.js"
import user from "../../model/user.js"
import wishLists from "../../model/wishlists.js"

export const getProductInWishlists = async (req, res) => {
    try {

        const { token } = req.headers
        const { id } = req.params

        if (!token) return res.status(401).json({
            type: "error",
            message: "No token provided."
        })

        const isExpiredToken = await isTokenExpired(res, token)
        if (isExpiredToken) return res.status(401).json({
            type: "error",
            message: "Invalid token, please try again later."
        })

        const verifiedUser = await verifyUserToken(token)
        const findUser = await user.findById(verifiedUser?.user_id)
        if (verifiedUser?.role !== 'admin' && findUser?._id.toString() !== id) return res.status(401).json({
            type: "error",
            message: "Unauthorized user."
        })

        if (!isValidObjectId(id)) return res.status(401).json({
            type: "error",
            message: "Please enter a valid id."
        })

        const getUserCartAllocated = await wishLists.findOne({ user_id: id })

        if (!getUserCartAllocated) return res.status(404).json({
            type: "error",
            message: "Wishlists not found, please add a product."
        })

        const results = await wishLists.aggregate([
            {
                "$match": {
                    "user_id": id
                }
            },
            {
                "$unwind": "$wish_lists"
            },
            {
                "$addFields": {
                    "product_id": { $toObjectId: "$wish_lists.product_id" }
                }
            },
            {
                "$lookup": {
                    "from": "products",
                    "localField": "product_id",
                    "foreignField": "_id",
                    "as": "lists"
                }
            },
            {
                "$project": {
                    user_id: 1,
                    "lists": 1,
                }
            },
            {
                "$unwind": "$lists"
            },
            {
                "$group": {
                    "_id": "$_id",
                    "user_id": { "$first": "$user_id" },
                    "wish_lists": { "$push": "$lists" }
                }
            }
        ])

        return res.status(200).json({
            type: "success",
            data: results?.length ? results?.[0] : {}
        })

    } catch (error) {
        return serverError(error, res)
    }
}