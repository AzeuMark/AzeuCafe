import mongoose from 'mongoose'

/**
 * DB connection — keeps MONGO_URI in server/.env.
 * Local MongoDB today, a Mongo Atlas URI later: zero code change.
 */
export async function connectDB() {
  const uri = process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/azeucafe'
  try {
    await mongoose.connect(uri)
    console.log('🗄️  MongoDB connected →', mongoose.connection.name)
  } catch (err) {
    console.error('MongoDB connection failed:', err.message)
    console.error('Is "mongod" service running? Check MONGO_URI in server/.env')
    throw err
  }
}
