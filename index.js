import express from 'express'

import characterCtrl from './controllers/character'

const port = 9001
const app = express()

app.set('view engine', 'ejs')

app.get('/characters', characterCtrl.get)
app.get('/characters/:name', characterCtrl.getOne)

app.listen(port, e => {
  if (e) console.error(e)
  else console.log(`Listening on port: ${port}`)
})
