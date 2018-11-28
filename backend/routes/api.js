const express = require('express')
const fs = require('fs')
const app = express.Router()

app.get('/:directory/:image', (req, res) => {
  let directory = req.params.directory || ''
  const image = req.params.image || ''
  if (directory === '' || image === '') return res.send('non-path')
  directory = directory.replace(/_+/g, '/')
  const url = `https://simg3.gelbooru.com/images/${directory}/${image}`
  const request = require('request').defaults({ encoding: null })
  request.get(url, function (err, response, body) {
    if (err || response.statusCode !== 200) return res.send('error')
    const fileName = 'download.jpg'
    const fileContents = Buffer.from(body, 'base64')
    const savedFilePath = '/temp/' + fileName
    fs.writeFile(savedFilePath, fileContents, function () {
      res.download(savedFilePath, fileName)
    })
  })
})

module.exports = app