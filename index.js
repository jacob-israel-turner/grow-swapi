import express from 'express'

import characterCtrl from './controllers/character'

const port = 9001
const app = express()

app.get('/characters', characterCtrl.get)

app.listen(port, e => {
  if (e) console.error(e)
  else console.log(`Listening on port: ${port}`)
})
