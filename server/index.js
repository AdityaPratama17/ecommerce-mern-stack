// import 
import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import fileUpload from "express-fileupload"
import cookieParser from "cookie-parser"
import router from "./routes/routes.js"

// inisialisasi
const app = express()
dotenv.config()
const port = process.env.PORT || 5000

// middlewares
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}))
app.use(cookieParser())
app.use(express.json())
app.use(fileUpload())
app.use(express.static("public"))
app.use("/api", router)

// database connection
mongoose.connect(process.env.DB_URI)
.then(() => console.log("Connected to the database!"))
.catch((err) => console.log(err))

// start server
app.listen(port, () => console.log(`server running at http://localhost:${port}`))