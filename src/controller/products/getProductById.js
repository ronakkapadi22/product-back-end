import { serverError } from "../../helpers/errors.js"
import { arrayFormatter } from "../../helpers/formatter.js"
import product from "../../model/product.js"

export const getProductById = async (req, res) => {
    const { id } = req.params
    try {
        const products = await product.findById(id)
        if (!products) return res.status(404).json({
            type: "error",
            message: "product not found!"
        })
        return res.json({
            type: "success",
            data: products
        })
    } catch (error) {
        return serverError(error, res)
    }
}
