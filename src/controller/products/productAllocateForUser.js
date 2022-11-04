import { serverError } from "../../helpers/errors.js"
import { allFieldsRequired, isTokenExpired, verifyUserToken } from "../../helpers/index.js"
import cart from '../../model/cart.js'
import product from "../../model/product.js"
import user from "../../model/user.js"


export const productAllocateForUser = async(req, res) => {
    const { product_id, qty, color, category  } = req.body
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

        const isAllFieldRequired = allFieldsRequired([product_id, qty, color, category])
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

        // add poduct allocate in cart for user

        const getUserCartAllocated = await cart.findOne({user_id: id})
        const getFindProduct = await product.findById(product_id)

        if(!getFindProduct) return res.status(404).json({
            type: "error",
            message: "Product not found, please add another product."
        })

        const { product_name, product_image, product_description, price, countryOfOrigin } = getFindProduct

        if(!getUserCartAllocated){  
            const data = new cart({
                user_id: id,
                cart_data: [{
                    product_id,
                    product_name,
                    product_description,
                    product_image,
                    qty,
                    price,
                    color,
                    category,
                    countryOfOrigin
                }]
            })

            const cartData = await data.save()

            return res.status(201).json({
                type: "success",
                message: "Product added to cart successfully.",
                data: cartData
            })
        }

       const { cart_data } =  getUserCartAllocated

       cart_data.push({
        product_id,
        product_name,
        product_description,
        product_image,
        qty,
        price,
        color,
        category,
        countryOfOrigin
    })

    const cartData = await getUserCartAllocated.save()

    return res.status(201).json({
        type: "success",
        message: "Product added to cart successfully.",
        data: cartData
    })

    } catch (error) {
        return serverError(error, res)
    }
}