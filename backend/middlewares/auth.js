import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../controlers/userController.js'

const authUser = async (req,res,next) =>{
    const {token} = req.headers
    if (!token) {
        return res.json({success:false, message: 'Pas Authoriser Connectez vous Svp'})
    }


    try {
    const token_decode = jwt.verify(token,JWT_SECRET)
    req.body.userId = token_decode.id
    next()
    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
}

} 
export default authUser