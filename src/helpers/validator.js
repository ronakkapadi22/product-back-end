import { check, validationResult } from 'express-validator'

export const validateUser = [
    check('username')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('User name can not be empty!')
        .bail()
        .isLength({ min: 3 })
        .withMessage('Minimum 3 characters required!')
        .bail(),
    check('email')
        .trim()
        .normalizeEmail()
        .isEmail()
        .not()
        .isEmpty()
        .withMessage('Invalid email address!')
        .bail(),
    check('contact')
        .trim()
        .isMobilePhone()
        .not()
        .isEmpty()
        .withMessage('Invalid contact number!')
        .bail(),
    check('password')
        .not()
        .isEmpty()
        .withMessage('Password cannot be empty')
        .isLength({ min: 6 })
        .withMessage('Password must be more that 6 charecters'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors?.isEmpty())
            return res.status(400).json({ errors: errors?.array()?.map(val => {return { name: val?.param, error: val?.msg }}) });
        next();
    }
]