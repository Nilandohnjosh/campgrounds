const express = require('express')
const server = express()
const mongoose = require('mongoose')
const ejsMate = require('ejs-mate')
const path = require('path')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const localStrategy = require('passport-local')

// imports
const { campgroundSchema, reviewSchema } = require('./schemas.js')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const User = require('./models/user')

// Routes
const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')

// Models
const Campground = require('./models/campground.js')
const Review = require('./models/review.js')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('connected to mongodb')
})

server.engine('ejs', ejsMate)
server.set('view engine', 'ejs')
server.set('views', path.join(__dirname, 'views'))

// middleware
server.use(express.static(path.join(__dirname, 'public')))
server.use(express.urlencoded({ extended: true }))
server.use(methodOverride('_method'))

const sessionConfig = {
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
}

server.use(session(sessionConfig))
server.use(flash())

server.use(passport.initialize())
server.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

server.use((req, res, next) => {
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next()
})

// Routes
server.use('/campgrounds', campgrounds)
server.use('/campgrounds/:id/reviews', reviews)

server.get('/', (req, res) => {
  res.render('home')
})

server.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

server.use((err, req, res, next) => {
  const { statusCode = 500 } = err
  if (!err.message) err.message = 'Oh No, Something Went Wrong!'
  res.status(statusCode).render('error', { err })
})

server.listen(3000, () => {
  console.log('Server is running on port 3000')
})
