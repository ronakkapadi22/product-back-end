import { serverError } from "../helpers/errors.js"
import { generateNewToken } from "../helpers/index.js"
import sendEmailService from "../helpers/mailService.js"
import user from "../model/user.js"

export const forgotPassword = async (req, res) => {
    const { email } = req.body
    try {

        if (!email) return res.status(400).json({
            type: "error",
            message: "Email is required."
        })

        const findUser = await user.findOne({ email })

        if (!findUser) return res.status(400).json({
            type: "error",
            message: "please enter a authorized email address."
        })

        const generateToken = await generateNewToken({
            user_id: findUser?._id,
            email: findUser?.email,
            role: findUser?.role,
            username: findUser?.username,
            contact: findUser?.contact
        })

        const link = `http://127.0.0.1:3000/reset-password/${findUser?._id}?token=${generateToken}`;
        const isEmailSent = await sendEmailService(findUser?.email, "Password reset", link);

        if (isEmailSent) {
            return res.status(200).json({
                type: "success",
                message: "Link has been sent authorized email address.",
            })
        }

    } catch (error) {
        return serverError(error, res)
    }
}