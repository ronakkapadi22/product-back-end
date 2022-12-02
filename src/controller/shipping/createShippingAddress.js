import { serverError } from "../../helpers/errors.js"
import { allFieldsRequired, isTokenExpired, isValidObjectId, verifyUserToken } from "../../helpers/index.js"
import shippingAddress from "../../model/shipping.js"
import user from "../../model/user.js"


export const createShippingAddress = async(req, res) => {
    try {
        
        const { shipping_name, 
            contact_number, 
            country, landmark, 
            type_of_address, 
            area, 
            address_line_1, 
            address_line_2, 
            city, 
            state, 
            pin_code } = req.body
        const { token } = req.headers
        const { id } = req.params

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

        const isAllFieldRequired = allFieldsRequired([shipping_name, contact_number, country, landmark, address_line_1, city, state, pin_code])
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

        const data = new shippingAddress({
            user_id: id,
            shipping_name,
            contact_number,
            country,
            shipping_address: {
                address_line_1,
                address_line_2,
                city, 
                state,
                pin_code
            },
            area, 
            landmark,
            type_of_address
        })

        console.log('data', data)

        const addressData = await data.save()

        console.log('addressData', addressData)

        return res.status(201).json({
            type: "success",
            message: "Product added successfully.",
            data: addressData
        })

    } catch (error) {
        return serverError(error, res)
    }
}