import User from "../models/User.js"
import bcrypt from 'bcryptjs'
import { createError } from "../utils/error.js";
import jwt from 'jsonwebtoken'

export const register = async(req, res, next)=>{
   try {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({
           ...req.body,
           password: hash,
        });
        const savedUser = await newUser.save();
        const { password, ...otherDetails } = savedUser._doc;
        const token = jwt.sign({
           id: savedUser._id,
           isAdmin: savedUser.isAdmin
        }, process.env.JWT_SECRET);
        res.cookie("access_token", token, {
           httpOnly: true
        }).status(201).json({ details: { ...otherDetails, isAdmin: savedUser.isAdmin }, token });
   } catch (error) {
      next(error);
   }
}
// Login
export const login = async(req, res, next)=>{
   try {
       const user = await User.findOne({
          username: req.body.username
       })
       if(!user) return next(createError(404, "user not found"))
         const isCorrect = await bcrypt.compare(req.body.password, user.password)
       if(!isCorrect){
         return next(createError(400, "user not found or password not match!"))
       }

         const {password, isAdmin, ...otherDetails} = user._doc
         const token = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
         }, process.env.JWT_SECRET)

         res.cookie("access_token", token, {
            httpOnly: true
         }).status(200).json({details:{...otherDetails, isAdmin}, token})
       
    } catch (error) {
       next(error) 
    }
}