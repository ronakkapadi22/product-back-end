import mongoose from 'mongoose'
import { config } from '../config/config.js'

const options = {
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10*1000, // 1s timeout
  };
const db = mongoose.connect(config.CONNECTION_URL, options).then(() => {
    console.log('connection successfully')
}).catch((error) => {
    console.log('error', error)
})

export default db