import { handleAdminAccess, isTokenExpired, verifyUserToken } from "../../helpers/index.js"
import { serverError } from "../../helpers/errors.js"
import user from "../../model/user.js"
import cart from "../../model/cart.js"

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



        const cartData = await handleAdminAccess(token) ? await cart.find({}) : await cart.findOne({user_id: id})
        
        return res.status(200).json({
            type: "success",
            data: await handleAdminAccess(token) ? cartData : cartData?.cart_data
        })

    } catch (error) {
    return serverError(error, res)
}
}