import axios from 'axios'

const baseUrl = 'http://swapi.co/api'
let peopleCache = []
let characterSortFields = ['', 'name', 'height', 'mass']

export default {
  getCharacters
}

const cachePassword = establishCache()
cachePassword.then(() => console.log('cache established'))

async function getCharacters({limit, start, sort, asc}) {
  let up = asc ? 1 : -1
  let down = asc ? -1 : 1
  await cachePassword
  if (!characterSortFields.includes(sort)) throw new Error(`'${sort}' is not a valid sort field`)
  let sortedPeopleCache
  if (sort) sortedPeopleCache = peopleCache
    .sort((a, b) => {
      let aVal = a[sort]
      let bVal = b[sort]
      if (aVal === bVal || isNaN(aVal) && isNaN(bVal)) {
        if (a.name > b.name) return up
        else return down
      }
      if (sort === 'height' || sort === 'mass') {
        aVal = Number(aVal.replace(',', ''))
        bVal = Number(bVal.replace(',', ''))
        if (isNaN(bVal)) return up;
        if (isNaN(aVal)) return down;
      }
      let isBigger = aVal > bVal
      if (isBigger) return up
      else return down
    })
  else sortedPeopleCache = peopleCache
  return sortedPeopleCache
    .slice(start - 1, start + limit - 1)
}

function establishCache() {
  const peopleResultsPromise = axios.get(`${baseUrl}/people`)
  return peopleResultsPromise
    .then(handleRes)
  function handleRes({data}) {
    peopleCache = peopleCache.concat(data.results)
    if (data.next) return axios.get(data.next).then(handleRes)
  }
}
