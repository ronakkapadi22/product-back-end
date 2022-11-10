import express from 'express'
import * as dotenv from 'dotenv'
dotenv.config()
import cors from 'cors'
import db from './src/db/db.js';
import router from './src/router/router.js';


const PORT = 4000 || process.env.PORT
const HOST = process.env.HOST
const App = express();

db.then(() => {
    console.log('started')
}).catch((error) => console.log(error))

// default json format middleware
App.use(express.json())
App.use(cors())
App.use("/api", router)

App.get('/api', (req, res) => res.status(200).json({ message: "Server started" }))


App.listen(PORT, () => {
    console.log(`Listening at http://${HOST}:${PORT}/api`)
})
