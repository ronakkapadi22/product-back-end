import { allFieldsRequired, isTokenExpired, isValidObjectId, verifyUserToken } from "../../helpers/index.js"
import { serverError } from "../../helpers/errors.js"
import user from "../../model/user.js"
import product from "../../model/product.js"
import wishLists from "../../model/wishlists.js"

export const addProductInWishlists = async (req, res) => {
    try {
        const { token } = req.headers
        const { id } = req.params
        const { product_id } = req.body

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

        const isAllFieldRequired = allFieldsRequired([product_id])
        if (isAllFieldRequired) return res.status(400).json({
            type: "error",
            message: "All fields are required."
        })

        const verifiedUser = await verifyUserToken(token)
        const findUser = await user.findById(verifiedUser?.user_id)
        if (verifiedUser?.role !== 'admin' && findUser?._id.toString() !== id) return res.status(401).json({
            type: "error",
            message: "Unauthorized user."
        })

        const getUserCartAllocated = await wishLists.findOne({ user_id: id })

        if (!isValidObjectId(product_id)) return res.status(401).json({
            type: "error",
            message: "Invalid id."
        })

        const getFindProduct = await product.findById(product_id)

        if (!getFindProduct) return res.status(404).json({
            type: "error",
            message: "Product not found, please add another product."
        })

        const { _id } = getFindProduct

        if (!getUserCartAllocated) {

            const data = new wishLists({
                user_id: id,
                wish_lists: [{ product_id: _id.toString() }]
            })

            await data.save()

            return res.status(201).json({
                type: "success",
                message: "Product added to wishlist successfully."
            })
        }

        const { wish_lists } =  getUserCartAllocated
        const cloneData = await wish_lists.map(data => data.product_id)

        if(cloneData.includes(_id.toString())) return res.status(400).json({
            type: "error",
            message: "Product already added in wishlist."
        })

        wish_lists.push({ product_id: _id.toString() })
        await getUserCartAllocated.save()
    
        return res.status(201).json({
            type: "success",
            message: "Product added to wishlist successfully.",
        })

    } catch (error) {
        return serverError(error, res)
    }
}