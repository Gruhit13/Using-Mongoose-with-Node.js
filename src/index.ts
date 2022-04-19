import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import { Cors } from './helper/cors.helper';
import routes from './routes';


dotenv.config({ path: "../.env" })

//  Connect to mongodb server
mongoose.connect(`mongodb://localhost:${process.env.DB_PORT}/e_commerce`)

const app = express()

Cors.enable(app)

app.use('/', express.static(path.resolve(__dirname, "../assets")))
app.use(bodyParser.json())

//  list to up-coming requests
app.listen(process.env.PORT, () => {
    console.log(`Connection set up on port:${process.env.PORT}`)
})

app.use(routes)