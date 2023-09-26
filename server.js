import express from "express"
import dotenv from "dotenv"
import morgan from "morgan"
import dbconnect from "./config/db.js"
import AuthRoute from './routes/AuthRoute.js'
import CategoryRoute from './routes/CategoryRoute.js'
import ProductRoute from './routes/ProductRoute.js'
import cors from "cors"
import path from 'path'
// configure env
dotenv.config()


//connection db
dbconnect()

//objects
const app = express()

//middleware
app.use(morgan("dev"))
app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, './client/build')))

// routes
//Authentication
app.use("/api/v1/auth", AuthRoute)

//category
app.use("/api/v1/category", CategoryRoute)

//product
app.use("/api/v1/product", ProductRoute)
//rest Api

app.use("*", function (req, res) {
    res.sendFile(path.join(__dirname, './client/build/index.html'))
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {

})