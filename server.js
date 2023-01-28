const express = require('express')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
//handles cookie/session to see if a user is logged in
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
//error message for incorrect password etc
const flash = require('express-flash')
// logs the requests
const logger = require('morgan')
const connectDB = require('./config/database')
const mainRoutes = require('./routes/main')
const todoRoutes = require('./routes/todos')

require('dotenv').config({path: './config/.env'})

// Passport config
require('./config/passport')(passport)

connectDB()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
//runs morgan
app.use(logger('dev'))
// Sessions
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      //stores each session in mongoose
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  )
  
// Passport middleware
app.use(passport.initialize())
app.use(passport.session())
//runs flash alerts
app.use(flash())
// routes set up
app.use('/', mainRoutes)
app.use('/todos', todoRoutes)

app.listen(process.env.PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    