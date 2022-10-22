import { Router } from "express";
import { changePassword } from "../controller/change-password.js";
import { createProduct } from "../controller/products/createProduct.js";
import { deleteUser } from "../controller/deleteUser.js";
import { forgotPassword } from "../controller/forgotPassword.js";
import { getAllUsers } from "../controller/getAllUsers.js";
import { getUser } from "../controller/getUser.js";
import { resetPassword } from "../controller/resetPassword.js";
import { userLogin } from "../controller/userLogin.js";
import { createUserRegistration } from "../controller/userRegistration.js";
import { emailValidator, passwordValidator, validateUser } from "../middleware/validator.js";
import { getAllProducts } from "../controller/products/getAllProducts.js";
import { upload } from "../helpers/s3-bucket.js";
import { productAllocateForUser } from "../controller/products/productAllocateForUser.js";
import { updateProductAllocateForUser } from "../controller/products/updateProductAllocateForUser.js";
import { deleteProductAllocateForUser } from "../controller/products/deleteProductAllocateForUser.js";
import { deleteProduct } from "../controller/products/deleteProduct.js";
import { getProductAllocateForUser } from "../controller/products/getProductAllocateForUser.js";

const router = Router()


// auth and user access routes
router.post('/registration', validateUser, createUserRegistration)
router.post('/login', userLogin)
router.post('/forgot-password', emailValidator, forgotPassword)
router.put('/reset-password', passwordValidator, resetPassword)
router.put('/change-password', passwordValidator, changePassword)
router.get('/get-users', getAllUsers)
router.get('/get-users/:id', getUser)
router.delete('/get-users/delete/:id', deleteUser)


// products routes
router.post('/create-product', upload.fields([{ name: 'product_image', maxCount: 1 }, { name: 'product_images', maxCount: 5 }]), createProduct)
router.get('/all-products', getAllProducts)
router.delete('/all-products/delete/:id', deleteProduct)
router.get('/add-to-cart/cart/:id', getProductAllocateForUser)
router.post('/add-to-cart/:id', productAllocateForUser)
router.put('/add-to-cart/update/:id', updateProductAllocateForUser)
router.delete('/add-to-cart/delete/:id', deleteProductAllocateForUser)

export default router
