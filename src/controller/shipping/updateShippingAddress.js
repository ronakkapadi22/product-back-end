import { serverError } from "../../helpers/errors.js"
import { isTokenExpired, isValidObjectId, verifyUserToken } from "../../helpers/index.js"
import shippingAddress from "../../model/shipping.js"
import user from "../../model/user.js"

export const updateShippingAddress = async (req, res) => {
    try {

        const { 
            address_id, 
            type_of_address, 
            isDefaultShipping, 
            address_line_1, 
            city, country, 
            state, area, 
            pin_code, landmark, 
            shipping_name, 
            contact_number } = req.body
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

        if (!isValidObjectId(id) || !isValidObjectId(address_id)) return res.status(401).json({
            type: "error",
            message: "Please enter a valid id."
        })

        const verifiedUser = await verifyUserToken(token)
        const findUser = await user.findById(verifiedUser?.user_id)
        if (verifiedUser?.role !== 'admin' && findUser?._id.toString() !== id) return res.status(401).json({
            type: "error",
            message: "Unauthorized user."
        })

        const getShippingAddress = await shippingAddress.findById(address_id)

        if (!getShippingAddress) return res.status(404).json({ type: "error", message: "Not found." })

        getShippingAddress.isDefaultShipping = (typeof isDefaultShipping == "boolean") ? isDefaultShipping : getShippingAddress.isDefaultShipping
        getShippingAddress.contact_number = contact_number || getShippingAddress.contact_number
        getShippingAddress.shipping_name = shipping_name || getShippingAddress.shipping_name
        getShippingAddress.landmark = landmark || getShippingAddress.landmark
        getShippingAddress.type_of_address = type_of_address || getShippingAddress.type_of_address
        getShippingAddress.country = country || getShippingAddress.country
        getShippingAddress.area = area || getShippingAddress.area
        getShippingAddress.shipping_address.city = city || getShippingAddress.shipping_address.city
        getShippingAddress.shipping_address.address_line_1 = address_line_1 || getShippingAddress.shipping_address.address_line_1
        getShippingAddress.shipping_address.state = state || getShippingAddress.shipping_address.state
        getShippingAddress.shipping_address.pin_code = pin_code || getShippingAddress.shipping_address.pin_code

        const data = await getShippingAddress.save()

        return res.status(201).json({
            type: "success",
            message: "Shipping address updated successfully.",
            data
        })

    } catch (error) {
        return serverError(error, res)
    }
}