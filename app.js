const express = require('express')
const mongoose = require('mongoose')
const server = express()
const path = require('path')
const methodOverride = require('method-override')

const Campground = require('/Users/nilandohnngaoluangraj/webdev/udemy/Web Developer Bootcamp/section39/models/campgroud.js')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useUnifiedTopology: true,
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.log('connected to mongodb')
})

server.set('view engine', 'ejs')
server.set('views', path.join(__dirname, 'views'))

server.use(express.static('public'))
server.use(express.urlencoded({ extended: true }))
server.use(methodOverride('_method'))

server.get('/', (req, res) => {
  res.render('home')
})

server.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campgrounds/index', { campgrounds })
})

server.get('/campgrounds/new', (req, res) => {
  res.render('campgrounds/new')
})

server.post('/campgrounds', async (req, res) => {
  const campground = await Campground.create(req.body.campground)
  await campground.save()
  res.redirect(`/campgrounds/${campground._id}`)
})

server.get('/campgrounds/:id', async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findById(id)
  res.render('campgrounds/show', { campground })
})

server.get('/campgrounds/:id/edit', async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findById(id)
  res.render('campgrounds/edit', { campground })
})

server.put('/campgrounds/:id', async (req, res) => {
  const { id } = req.params
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  })
  res.redirect(`/campgrounds/${campground._id}`)
})

server.delete('/campgrounds/:id', async (req, res) => {
  const { id } = req.params
  await Campground.findByIdAndDelete(id)
  res.redirect('/campgrounds')
})

server.get('/makecampground', async (req, res) => {
  const camp = new Campground({
    title: 'My Backyard',
    price: '12',
    description: 'This is a new campground',
    location: 'Backyard',
  })
  await camp.save()
  res.send(camp)
})

server.listen(3000, () => {
  console.log('Server is running on port 3000')
})
