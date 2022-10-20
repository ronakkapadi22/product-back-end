import { allFieldsRequired, comparePassword, generateNewToken } from "../helpers/index.js"
import user from "../model/user.js"

export const userLogin = async (req, res) => {
    const { email, password } = req.body
    try {
        const isAllFieldRequired = allFieldsRequired([email, password])
        if (isAllFieldRequired) return res.status(400).json({
            type: "error",
            message: "All fields are required."
        })

        const findUser = await user.findOne({ email })
        if (!findUser) return res.status(400).json({
            type: "error",
            message: "user not found this email address."
        })

        const isAuthenticated = await comparePassword(password, findUser?.password)

        if (!isAuthenticated) return res.status(401).json({
            type: "error",
            message: "Invalid username or password."
        })

        return res.status(200).json({
            type: "success",
            message: "User login successfully",
            token: await generateNewToken({
                user_id: findUser?._id,
                email: findUser?.email,
                role: findUser?.role,
                username: findUser?.username,
                contact: findUser?.contact
            })
        })


    } catch (error) {
        return res.status(500).json({
            type: 'error',
            message: error.message || 'Something went wrong.',
        });
    }
}
