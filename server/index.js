const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const prefix = '/api'
const productRoute = require('./routes/products')
const orderRoute = require('./routes/orders')
const userRoute = require('./routes/users')

const mongoose = require('mongoose');

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'
const mongoConfig = require('./mongoConfig');

//In a mongoConfig.js file enter you configuration for the DataBase
mongoose.connect(`mongodb+srv://dbFood:${mongoConfig.PW}@node-rest-food-7cmcn.mongodb.net/test?retryWrites=true&w=majority`, {
  useNewUrlParser: true 
})

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  app.use(express.json()) // for parsing application/json
  app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use('/uploads', express.static('uploads'))
  app.use(`${prefix}/products`, productRoute);
  app.use(`${prefix}/orders`, orderRoute);
  app.use(`${prefix}/users`, userRoute);

  app.get('/api', function(req, res) {
    res.send('Hello World')
  })

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express

  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
