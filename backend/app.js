const express = require('express')
const http = require('http')
const createError = require('http-errors')
const path = require('path')
const logger = require('morgan')
const index = require('./routes/index')
const api = require('./routes/api')

const app = express()
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/', index)
app.use('/api', api)
app.use((req, res, next) => {
  next(createError(404))
})
app.use((err, req, res, next) => {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.render('error')
})

http.createServer(app.listen(3000, () => {
  console.log('gelbooru image download server start...')
}))

module.exports = app