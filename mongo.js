import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
dotenv.config()
const connectionString = process.env.MONGO_DB_URI

// MongoDB Connection

mongoose.connect(connectionString)
  .then(() => {
    console.log('Database connected')
  }).catch(error => {
    console.error(error)
  })
