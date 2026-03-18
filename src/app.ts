import express from "express"
import { postRoutes } from "./module/post/post.route";

const app = express();
app.use(express.json())
app.get('/',(req,res)=>{
    console.log("Next level web developer");
    res.send('Next level web developer')
})

app.use('/', postRoutes)

export default app;