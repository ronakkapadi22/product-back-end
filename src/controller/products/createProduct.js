import { allFieldsRequired, handleAdminAccess, isTokenExpired } from "../../helpers/index.js"
import product from "../../model/product.js"

export const createProduct = async (req, res) => {
    const {
        product_name,
        product_description,
        category,
        colors,
        price,
        rating,
        countryOfOrigin
    } = req.body
    const { token } = req.headers
    const { product_image, product_images } = req.files

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

        const isAllFieldRequired = allFieldsRequired([product_name, price, product_description, category, colors])
        if (isAllFieldRequired) return res.status(400).json({
            type: "error",
            message: "All fields are required."
        })

        const isAdmin = await handleAdminAccess(token)

        if(!isAdmin) return res.status(401).json({
            type: "error",
            message: "Unauthorized user."
        })

        const data = new product({
            product_name,
            product_image: product_image?.map(val => val?.location)?.toString(),
            product_description,
            price,
            category,
            colors,
            rating,
            products_images: product_images?.map(val => {return{src: val?.location, key: val?.etag}}),
            countryOfOrigin
        })
        const productData = await data.save()
        
        res.status(201).json({
            type: "success",
            message: "Product added successfully.",
            data: productData
        })

    } catch (error) {
        return res.status(500).json({
            type: 'error',
            message: error.message || 'Something went wrong.',
        });
    }
}
