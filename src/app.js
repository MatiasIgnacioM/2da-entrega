import express from 'express'
import handlebars from 'express-handlebars'
import { Server } from 'socket.io'
import Sockets from './sockets.js'
import mongoose from 'mongoose'
import productsRouter from './routers/product.router.js'
import cartsRouter from './routers/cart.router.js'
import viewsRouter from './routers/view.router.js'
import chatRouter from './routers/chat.router.js'

const MONGO_URI = 'mongodb://localhost:27017'
const MONGO_DB_NAME = 'monoschinos'
export const PORT = 8080

const app = express()
app.use(express.json())
app.use(express.static('./src/public'))
app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')

try {
    await mongoose.connect(MONGO_URI, { 
        dbName: MONGO_DB_NAME,
        useUnifiedTopology: true
    })
    console.log('DB connected!')
    const server = app.listen(PORT, () => console.log('Server Up'))
    const io = new Server(server)
    app.use((req, res, next) => {
        req.io = io
        next()
    })

    app.get('/', (req, res) => res.render('index'))
    app.use('/api/products', productsRouter)
    app.use('/api/carts', cartsRouter)
    app.use('/products', viewsRouter)
    app.use('/carts', viewsRouter)
    app.use("/chat", chatRouter)

    Sockets(io)
} catch(err) {
    console.log('Cannot connect to DB :(  ==> ', err.message)
    process.exit(-1)
}
