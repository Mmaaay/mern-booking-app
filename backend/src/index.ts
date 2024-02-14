import express , {Request , Response} from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'
import userRouter from './routes/users'
import authRouter from './routes/auth'
import cookieParser from "cookie-parser"
import path from 'path'
import { v2  as cloudinary} from 'cloudinary'
import hotelRouter from './routes/my-hotels'
import searchRouter from './routes/hotels'

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string)
const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true
}))

app.use(express.static(path.join(__dirname, "../../frontend/dist")))


app.use("/api/auth" , authRouter)
app.use("/api/users" , userRouter)
app.use("/api/my-hotels" , hotelRouter)
app.use("/api/hotels/", searchRouter)

//whenever there a conditional rendering of route that is conditional, thus it can be confused for api route which it is not

app.get("*" , (req:Request , res:Response)=>{res.sendFile(path.join(__dirname , '../../frontend/dist/index.html'))})

app.listen(7000 , ()=>{
    console.log('server is running on 7000')
})