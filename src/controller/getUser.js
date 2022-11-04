import { serverError } from '../helpers/errors.js'
import { isTokenExpired, isValidObjectId, verifyUserToken } from '../helpers/index.js'
import user from '../model/user.js'



export const getUser = async (req, res) => {

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

        if (!isValidObjectId(id)) return res.status(401).json({
            type: "error",
            message: "Please enter a valid id."
        })

        const verifiedUser = await verifyUserToken(token)
        const findUser = await user.findById(verifiedUser?.user_id)
        if(verifiedUser?.role !== 'admin' && findUser?._id.toString() !== id) return res.status(401).json({
            type: "error",
            message: "Unauthorized user."
        })
        const getUser = await user.findById(id)
        if (!getUser) return res.status(404).json({
            type: "error",
            message: "User not found."
        })
        const { _id, username, email, contact, role, created_At } = getUser
        return res.status(200).json({
            type: "success",
            data: { id: _id?.toString(), username, email, contact, role, created_At }
        })
    } catch (error) {
        return serverError(error, res)
    }
}