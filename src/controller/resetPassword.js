import { serverError } from "../helpers/errors.js"
import { allFieldsRequired, generateNewToken, hashPassword, verifyUserToken } from "../helpers/index.js"
import user from '../model/user.js'


export const resetPassword = async (req, res) => {
    const { password, confirm_password } = req.body
    const { token } = req.headers

    try {

        if (!token) return res.status(401).json({
            type: "error",
            message: "No token provided."
        })

        const isAllFieldRequired = allFieldsRequired([password, confirm_password])
        if (isAllFieldRequired) return res.status(400).json({
            type: "error",
            message: "All fields are required."
        })

        if (password !== confirm_password) return res.status(400).json({
            type: "error",
            message: "password and confirm password does not matched."
        })

        const verifiedUser = await verifyUserToken(token)
        const findUser = await user.findById(verifiedUser?.user_id)
        findUser.password = await hashPassword(password)
        const userData = await findUser.save()

        if (verifiedUser?.user_id === userData?._id.toString()) return res.status(201).json({
            type: "success",
            message: "Password reset successfully.",
            token: await generateNewToken({
                user_id: userData?._id,
                email: userData?.email,
                role: userData?.role,
                username: userData?.username,
                contact: userData?.contact
            })
        })

    } catch (error) {
        return serverError(error, res)
    }
}