const express = require('express')
const logger = require('morgan')
const cookiesParser = require("cookie-parser")
const cors = require("cors")
const xss = require('xss-clean')
const app = express();
const client = require('./esclient')

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000"
  })
)

app.use(xss())
app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookiesParser())

app.get('/search', async (req, res) => {
  var { key } = req.query;
  const searchRes = await client.search({
    index: 'blog',
    query:{
      match:{
        content: key
      }
    },
    highlight:{
      fields: {
        content: {},
      },
      pre_tags:'<b>',
      post_tags:'</b>'
    },
    _source:{
      includes:[
        "title",
        "auth",
        "url"
      ]
    },
    size: 20
  })
  return res.status(200).json(searchRes.hits.hits);
})

module.exports = app