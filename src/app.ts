import express from "express"
import { postRoutes } from "./module/post/post.route";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors"

const app = express();

app.use(cors({
    origin : process.env.APP_URL || "http://localhost:4000",
    credentials : true 
}))

app.all('/api/auth/*splat', toNodeHandler(auth));
app.use(express.json())
app.get('/',(req,res)=>{
    console.log("Next level web developer");
    res.send('Next level web developer')
})

app.use('/', postRoutes)

export default app;