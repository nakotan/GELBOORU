const express = require('express')
const app = express.Router()

app.get('/', (req, res, next) => {
  res.send('Hello, World! => /api/path/image')
})

module.exports = app