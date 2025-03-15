import mongoose from 'mongoose'
const MONGO_URI = process.env.MONGO_URI

if (!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable inside .env')
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('Connected to Database')
  } catch (error) {
    console.error('Error connecting to database', error)
    process.exit(1)
  }
}

export default connectDB 