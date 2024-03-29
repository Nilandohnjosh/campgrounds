const mongoose = require('mongoose')
const path = require('path')

const Campground = require('../models/campground')
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
  for (let i = 0; i < 5; i++) {
    const random1000 = Math.floor(Math.random() * 1000)
    const price = Math.floor(Math.random() * 20) + 10
    const camp = new Campground({
      author: '62e5e625a7c4b6d4506b4ba0',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: 'https://source.unsplash.com/collection/483251',
      description:
        'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Delectus dolore, molestias fugit nihil reiciendis quam enim dolorum, sint blanditiis illum quod eum totam cumque eveniet magnam. Facere voluptatem voluptates quibusdam!',
      price,
    })
    await camp.save()
  }
}

seedDb().then(() => {
  db.close()
})
