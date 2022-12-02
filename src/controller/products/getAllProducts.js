import { serverError } from "../../helpers/errors.js"
import { arrayFormatter } from "../../helpers/formatter.js"
import product from "../../model/product.js"

export const getAllProducts = async (req, res) => {
    try {
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
