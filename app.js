if (process.env.NODE_ENV === 'development') {
    require('dotenv').config()
}
const errHandler = require('./middlewares/errHandler')
const routes = require('./routes')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const cors = require('cors')

app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use('/', routes)
app.use(errHandler)

app.listen(PORT, () => {
    console.log(`This app is listening at ${PORT}`)
})