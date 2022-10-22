import { serverError } from "../../helpers/errors.js"
import { arrayFormatter } from "../../helpers/formatter.js"
import { handleAdminAccess, isTokenExpired } from "../../helpers/index.js"
import product from "../../model/product.js"

export const getAllProducts = async (req, res) => {
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

        const isAdmin = await handleAdminAccess(token)
        if (!isAdmin) return res.status(401).json({
            type: "error",
            message: "Unauthorized user."
        })

        const products = await product.find({})
        return res.json({
            type: "success",
            data: arrayFormatter(products, ['_id',
                'product_name',
                'product_image',
                'product_description',
                'price',
                'colors',
                'category',
                'products_images',
                'rating',
                'countryOfOrigin'])
        })
    } catch (error) {
        return serverError(error, res)
    }
}
