const mongoose = require('mongoose')
const path = require('path')

const Campground = require('../models/campgroud')
const cities = require('../seeds/cities')
const { places, descriptors } = require('../seeds/seedHelpers')

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

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)]

const seedDb = async () => {
  await Campground.deleteMany({})
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000)
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
    })
    await camp.save()
  }
}

seedDb().then(() => {
  db.close()
})
