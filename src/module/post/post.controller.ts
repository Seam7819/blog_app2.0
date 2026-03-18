import { Request, Response } from "express"
import { postService } from "./post.service"



const createPost = async (req:Request,res:Response)=>{
    try{
        const result = await postService.createPost(req.body);

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