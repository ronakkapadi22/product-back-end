import { serverError } from "../../helpers/errors.js"
import { allFieldsRequired, isTokenExpired, verifyUserToken } from "../../helpers/index.js"
import cart from '../../model/cart.js'
import user from "../../model/user.js"

export const updateProductAllocateForUser = async(req, res) => {
    const { color, qty } = req.body
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

        const fields = (!!color && !!qty) ? [qty, color] : [qty || color]

        const isAllFieldRequired = allFieldsRequired(fields)
        if (isAllFieldRequired) return res.status(400).json({
            type: "error",
            message: "All fields are required."
        })

        const findCartProduct = await cart.findById(id)
        const verifiedUser = await verifyUserToken(token)
        const findUser = await user.findById(verifiedUser?.user_id)
        if(verifiedUser?.role !== 'admin' && findUser?._id.toString() !== findCartProduct?.user_id.toString()) return res.status(401).json({
            type: "error",
            message: "Unauthorized user."
        })

        if(!!qty && !! color){
            findCartProduct.qty = Number(qty)
            findCartProduct.color = String(color)
        }else if(!!qty){
            findCartProduct.qty = Number(qty)
        }else{
            findCartProduct.color = String(color)
        }

        const data = await findCartProduct.save()

        res.status(201).json({
            type: "success",
            message: "Product updated to cart successfully.",
            data
        })

    } catch (error) {
        return serverError(error, res)
    }
}