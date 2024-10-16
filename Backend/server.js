import express from 'express'
import 'dotenv/config'
import connectDb from './config/db.js'
import authRoute from './routes/authRoute.js'
import venueRoute from './routes/venueRoutes.js'
import activityRoute from './routes/activityRoutes.js'
import cors from 'cors'
const app = express()
connectDb()

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoute)
app.use('/api/venues', venueRoute)
app.use('/api/activities', activityRoute)
// app.use('/api/category', categoryRoute)
// app.use('/api/product', productRoute)

app.get('/', (req, res) => {
    res.send({ message: 'Hello World' })
})


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})