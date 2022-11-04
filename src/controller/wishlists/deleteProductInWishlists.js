import { allFieldsRequired, isTokenExpired, isValidObjectId, verifyUserToken } from "../../helpers/index.js"
import { serverError } from "../../helpers/errors.js"
import wishLists from "../../model/wishlists.js"
import product from "../../model/product.js"
import user from "../../model/user.js"

export const deleteProductInWishlists = async(req, res) => {
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
            message: "Please provide a valid id."
        })

        const getFindProduct = await product.findById(product_id)

        if (!getFindProduct) return res.status(404).json({
            type: "error",
            message: "Product not found."
        })

        const { _id } = getFindProduct
        const { wish_lists } =  getUserCartAllocated
        const findIndex = wish_lists?.findIndex(value => value?.product_id === product_id)

        if(findIndex === -1) return res.status(400).json({
            type: "error",
            message: "Product not found in wishlist."
        })

        wish_lists.splice(findIndex, 1)
        await getUserCartAllocated.save()
    
        return res.status(201).json({
            type: "success",
            message: "Product removed to wishlist successfully.",
        })
    } catch (error) {
        return serverError(error, res)
    }
}