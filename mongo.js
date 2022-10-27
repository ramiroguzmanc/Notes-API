import mongoose from 'mongoose'

const password = 'Letmein123'
const DBName = 'ramirogDB'

const connectionString = `mongodb+srv://ramirogdb:${password}@cluster0.xlbdosq.mongodb.net/${DBName}?retryWrites=true&w=majority`

// MongoDB Connection

mongoose.connect(connectionString)
  .then(() => {
    console.log('Database connected')
  }).catch(error => {
    console.error(error)
  })
