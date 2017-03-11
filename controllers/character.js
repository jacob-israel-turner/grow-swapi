import swapi from '../services/swapi'

export default {
  get
}

async function get(req, res) {
  let {limit = 10, start = 1, sort = '', asc = true} = req.query
  limit = Number(limit)
  start = Number(start)
  asc = !!(asc === true || asc === 'true')
  const characters = await swapi.getCharacters({limit, start, sort, asc})
  res.json(characters)
}
