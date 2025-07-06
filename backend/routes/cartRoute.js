import express from 'express'

import authUser from '../middlewares/auth.js'
import { addToCart, getUserCart, updateCart } from '../controlers/cartController.js'

const cartRouter = express.Router()

cartRouter.post('/get',authUser, getUserCart)
cartRouter.post('/add',authUser, addToCart)
cartRouter.post('/update',authUser, updateCart)

export default cartRouter