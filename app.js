const express = require('express')
const router = require('./Routes/product_routes.js')
const app = express()
const port = 8000

const morgan = require('morgan')
const mongoose = require('mongoose')
const catRouter = require('./Routes/category_routes')
const authRoute =  require('./Routes/user_routes.js')
const cors = require('cors')
const authJwt = require('./Helpers/jwt.js')
const errorHandler = require('./Helpers/error_handlers')
const route = require(`./Routes/order_routes.js`)

require('dotenv/config') 
app.use(morgan('tiny'))
app.use(express.json())
app.use(cors())
app.options('*', cors())
app.use(authJwt())
app.use(errorHandler)
app.use('/public/uploads', express.static(__dirname + 'public/uploads'))

app.use('/api/v1/product', router)
app.use('/api/v1/category', catRouter)
app.use('/api/v1/user', authRoute)
app.use(`/api/v1/order`, route)



mongoose.connect(process.env.CONNECTION_STRING)
.then(()=> {
    console.log('Database connected')
})
.catch((err)=>{
    console.log(err)
})

app.listen(port, () => 
    console.log(`server is listening on port ${port}!`))