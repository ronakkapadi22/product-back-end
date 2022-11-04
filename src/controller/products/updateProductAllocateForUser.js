import { serverError } from "../../helpers/errors.js"
import { allFieldsRequired, isTokenExpired, verifyUserToken } from "../../helpers/index.js"
import cart from '../../model/cart.js'
import product from "../../model/product.js"
import user from "../../model/user.js"

export const updateProductAllocateForUser = async(req, res) => {
    const { qty, product_id } = req.body
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

        const isAllFieldRequired = allFieldsRequired([qty, product_id])
        if (isAllFieldRequired) return res.status(400).json({
            type: "error",
            message: "All fields are required."
        })

        const findCartProduct = await cart.findOne({user_id: id})
        const verifiedUser = await verifyUserToken(token)
        const findUser = await user.findById(verifiedUser?.user_id)
        if(verifiedUser?.role !== 'admin' && findUser?._id.toString() !== findCartProduct?.user_id.toString()) return res.status(401).json({
            type: "error",
            message: "Unauthorized user."
        })

        const getUserCartAllocated = await cart.findOne({user_id: id})


        if(getUserCartAllocated){
           
            const { cart_data } = getUserCartAllocated
            const findIndex = cart_data.findIndex(data => data?._id?.toString() === product_id)
           
            if(findIndex === -1) return res.status(404).json({
                type: "error",
                message: "Product not found in the cart."
            })

            cart_data[findIndex].qty = qty
            const cartData = await getUserCartAllocated.save()
            
            res.status(201).json({
                type: "success",
                message: "Product updated to cart successfully.",
                data: cartData
            })
        }

    } catch (error) {
        return serverError(error, res)
    }
}