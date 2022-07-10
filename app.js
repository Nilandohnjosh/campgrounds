const express = require('express')
const mongoose = require('mongoose')
const server = express()
const path = require('path')

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

server.get('/', (req, res) => {
  res.render('home')
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
