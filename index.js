import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bodyparser from 'body-parser'
import cors from 'cors'

const app= express();
const corsConfig= {
    origin: process.env.BASE_URL,
    credentials: true
}

const PORT= process.env.PORT || 8000

app.use(bodyparser.json())
app.use(cors(corsConfig))
mongoose.set('strictQuery',false)


