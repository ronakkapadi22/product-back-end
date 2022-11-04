import { serverError } from "../../helpers/errors.js"
import { handleAdminAccess, isTokenExpired, isValidObjectId, verifyUserToken } from "../../helpers/index.js"
import shippingAddress from "../../model/shipping.js"
import user from "../../model/user.js"

export const getAllShippingAddressForUser = async(req, res) => {
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

        if (!isValidObjectId(id)) return res.status(401).json({
            type: "error",
            message: "Please enter a valid id."
        })

        const verifiedUser = await verifyUserToken(token)
        const findUser = await user.findById(verifiedUser?.user_id)
        if(verifiedUser?.role !== 'admin' && findUser?._id.toString() !== id) return res.status(401).json({
            type: "error",
            message: "Unauthorized user."
        })
        
        const allShippingAddresses = await shippingAddress.find(await handleAdminAccess(token) ? {} : {user_id: id})

        return res.status(200).json({
            type: "success",
            data: allShippingAddresses
        })

    } catch (error) {
        return serverError(error, res)
    }
}