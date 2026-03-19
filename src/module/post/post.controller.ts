import { Request, Response } from "express"
import { postService } from "./post.service"



const createPost = async (req:Request,res:Response)=>{
    try{

        console.log(req.user);
        if(!req.user){
            return res.status(500).json({
            success : false,
            message : "not authorized"
        })
        }
        const result = await postService.createPost(req.body, req.user.id as string);

        res.status(201).json({
            success: true,
            message: "Post created successfully",
            data : result
        })
    }catch(err){
        res.status(500).json({
            success : false,
            message : err
        })
    }
}

export const postController = {
    createPost
}