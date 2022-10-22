import product from "../../model/product.js"
import { handleAdminAccess, isTokenExpired } from "../../helpers/index.js"
import { serverError } from "../../helpers/errors.js"

export const deleteProduct = async(req, res) => {

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

        const isAdmin = await handleAdminAccess(token)
        if(!isAdmin) return res.status(401).json({
            type: "message",
            message: "Unauthorized user"
        })

        const deleteProduct = await product.findByIdAndDelete(id)
        if (!deleteProduct) return res.status(404).json({
            type: "error",
            message: "Product is not found."
        })

        return res.status(200).json({
            type: "success",
            message: "Product is deleted successfully.",
            data: deleteProduct?.toJSON()
        })

    } catch (error) {
        return serverError(error, res)
    }
}