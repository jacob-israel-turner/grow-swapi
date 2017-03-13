import swapi from '../services/swapi'
import ejs from 'ejs'

export default {
  get,
  getOne
}

async function get(req, res) {
  try {
    let {limit = 10, start = 1, sort = '', asc = true} = req.query
    limit = Number(limit)
    start = Number(start)
    asc = !!(asc === true || asc === 'true')
    const characters = await swapi.getCharacters({limit, start, sort, asc})
    res.json(characters)
  } catch (e) {
    console.error(e)
    res.status(500).send()
  }
}

async function getOne(req, res, next) {
  try {
    let {name} = req.params
    let {json} = req.query
    const character = await swapi.getCharacterByName(name)
    if (!character) return res.status(404).send(`Character '${name}' doesn't exist`)
    if (json) return res.json(character)
    res.render('character', character)
  } catch (e) {
    console.error(e)
    res.status(500).send()
  }
}
