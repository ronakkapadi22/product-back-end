import { serverError } from "../../helpers/errors.js"
import { allFieldsRequired, isTokenExpired, verifyUserToken } from "../../helpers/index.js"
import cart from '../../model/cart.js'
import user from "../../model/user.js"

export const deleteProductAllocateForUser = async(req, res) => {
    const { token } = req.headers
    const { product_id } = req.body
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

        const isAllFieldRequired = allFieldsRequired([product_id])
        if (isAllFieldRequired) return res.status(400).json({
            type: "error",
            message: "All fields are required."
        })

        const verifiedUser = await verifyUserToken(token)
        const findUser = await user.findById(verifiedUser?.user_id)
        if(verifiedUser?.role !== 'admin' && findUser?._id.toString() !== id) return res.status(401).json({
            type: "error",
            message: "Unauthorized user."
        })

        // delete allocate product for user

        const deleteAllocateProduct = await cart.findOne({user_id: id})

        if(deleteAllocateProduct){
            const { cart_data } = deleteAllocateProduct
            const findIndex = cart_data.findIndex(val => val?._id?.toString() === product_id)

            if(findIndex === -1) return res.status(404).json({
                type: "error",
                message: "Product not found in the cart."
            })

            cart_data.splice(findIndex, 1)
            await deleteAllocateProduct.save()

            return res.status(200).json({
                type: "success",
                message: "Product deleted successfully."
            })
        }

    } catch (error) {
        return serverError(error, res)
    }

}