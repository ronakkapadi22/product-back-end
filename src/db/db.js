import mongoose from 'mongoose'
import { config } from '../config/config.js'


const db = mongoose.connect(config.CONNECTION_URL).then(() => {
    console.log('connection successfully')
}).catch((error) => {
    console.log('error', error)
})

export default db