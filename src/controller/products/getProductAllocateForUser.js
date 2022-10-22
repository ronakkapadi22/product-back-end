import { isTokenExpired, verifyUserToken } from "../../helpers/index.js"
import { serverError } from "../../helpers/errors.js"
import user from "../../model/user.js"

export const getProductAllocateForUser = async (req, res) => {

    const { id } = req.params
    const { token } = req.headers

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

        const verifiedUser = await verifyUserToken(token)
        const findUser = await user.findById(verifiedUser?.user_id)
        if (verifiedUser?.role !== 'admin' && findUser?._id.toString() !== id) return res.status(401).json({
            type: "error",
            message: "Unauthorized user."
        })

        // aggregate for users and carts for product.
        const response = await user.aggregate([
            {
                $lookup: {
                    from: "carts",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "cart"
                }
            }
        ]).

        console.log('response', response)

        return res.json(response)

    } catch (error) {
    return serverError(error, res)
}
}