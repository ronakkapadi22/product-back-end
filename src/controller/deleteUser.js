import { serverError } from '../helpers/errors.js'
import { handleAdminAccess, isTokenExpired, isValidObjectId, verifyUserToken } from '../helpers/index.js'
import user from '../model/user.js'


export const deleteUser = async (req, res) => {
    const { token } = req.headers
    const { id } = req.params
    try {

        if (!token) return res.status(401).json({
            type: "error",
            message: "No token provided."
        })

        const isExpiredToken = await isTokenExpired(res, token)
        if(isExpiredToken) return res.status(401).json({
            type: "error",
            message: "Invalid token, please try again later."
        })

        const isAdmin = await handleAdminAccess(token)

        if (isAdmin) {
            if(!isValidObjectId(id)) return res.status(401).json({
                type: "error",
                message: "Please enter a valid user id."
            })
            const deleteObject = await user.findByIdAndDelete(id)
            if (!deleteObject) return res.status(404).json({
                type: "error",
                message: "User not found."
            })
            return res.status(200).json({
                type: "success",
                message: "User deleted successfully.",
                data: deleteObject?.toJSON()
            })
        } else return res.status(401).json({
            type: "error",
            message: "You are not able to delete this user."
        })

    } catch (error) {
        return serverError(error, res)
    }
}