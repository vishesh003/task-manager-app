import express from "express";
import User from "../models/User.js";
import verifyToken from "../middleware/auth.js";

const router=express.Router();

router.get("/", verifyToken, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get("/:id",async(req,res)=>{
    try {
        const user=await User.findById(req.params.id);
        if(!user) return res.status(404).json({message:"User not found"});
        res.json(user);
        
    } catch (error) {
        res.status(500).json({message:err.message});
        
    }
});
router.post("/",async (req,res)=>{
    try {
        const user=new User({
            name:req.body.name,
            email:req.body.email,
            age:req.body.age
        });
        const savedUser=await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({message: err.message});
        
    }
});
router.put("/:id",async (req,res)=>{
    try {
        const user=await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        );
        if(!user)return res.status(404).json({message:"User not found"});
        res.json(user);
    } catch (error) {
        res.status(400).json({message:err.message});
        
    }
})
router.delete("/:id",async (req,res)=>{
    try {
        const user=await User.findByIdAndDelete(req.params.id);
        if(!user)return res.status(404).json({message:"User not found"});
        res.json({message:"User deleted"});
    } catch (error) {
        res.status(500).json({message:err.message});
        
    }
});
export default router;