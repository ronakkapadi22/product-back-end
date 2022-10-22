import { serverError } from "../../helpers/errors.js"
import { isTokenExpired, verifyUserToken } from "../../helpers/index.js"
import cart from '../../model/cart.js'
import user from "../../model/user.js"

export const deleteProductAllocateForUser = async(req, res) => {
    const { token } = req.headers
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

        const findCartProduct = await cart.findById(id)
        const verifiedUser = await verifyUserToken(token)
        const findUser = await user.findById(verifiedUser?.user_id)
        if(verifiedUser?.role !== 'admin' && findUser?._id.toString() !== findCartProduct?.user_id.toString()) return res.status(401).json({
            type: "error",
            message: "Unauthorized user."
        })

        // delete allocate product for user
        const deleteAllocateProduct = await cart.findByIdAndDelete(id)
        if(!deleteAllocateProduct) return res.status(404).json({
            type: "error",
            message: "Product not found in the cart."
        })

        return res.status(200).json({
            type: "success",
            message: "Product deleted successfully.",
            data: deleteAllocateProduct?.toJSON()
        })

    } catch (error) {
        return serverError(error, res)
    }

}