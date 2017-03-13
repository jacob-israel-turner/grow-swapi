import axios from 'axios'

const baseUrl = 'http://swapi.co/api'
let peopleCache = []
let planetCache = []
let peopleNameCache = {}
let planetResidentCache = {}
let characterSortFields = ['', 'name', 'height', 'mass']

export default {
  getCharacters,
  getCharacterByName,
  getPlanetResidents,
}

const cachePromise = establishCache()
cachePromise.then(() => {
  peopleCache.forEach((person) => {
    const first = person.name.split(' ')[0]
    peopleNameCache[person.name.toLowerCase()] = person
    if (first !== person.name && !peopleNameCache[first]) peopleNameCache[first.toLowerCase()] = person
  })
  console.log('cache established')
})

async function getCharacters({limit, start, sort, asc}) {
  await cachePromise
  let up = asc ? 1 : -1
  let down = asc ? -1 : 1
  if (!characterSortFields.includes(sort)) throw new Error(`'${sort}' is not a valid sort field`)
  let sortedPeopleCache
  if (sort) sortedPeopleCache = peopleCache.sort(handleSort)
  else sortedPeopleCache = peopleCache
  return sortedPeopleCache
    .slice(start - 1, start + limit - 1)

  function handleSort(a, b) {
    const aVal = a[sort]
    const bVal = b[sort]
    if (aVal === bVal || isNaN(aVal) && isNaN(bVal)) return secondarySort(a, b)
    else if (sort === 'height' || sort === 'mass') return numericSort(a, b)
    else return stringSort(a, b)
  }

  function stringSort(a, b) {
    if (a[sort] > b[sort]) return up
    else return down
  }

  function numericSort(a, b) {
    const aVal = Number(a[sort].replace(',', ''))
    const bVal = Number(b[sort].replace(',', ''))
    if (isNaN(bVal) || aVal > bVal) return up;
    else  return down;
  }

  function secondarySort(a, b) {
    if (a.name > b.name) return up
    else return down
  }
}

async function getCharacterByName (name) {
  await cachePromise
  return peopleNameCache[name.toLowerCase()]
}

async function getPlanetResidents () {
  await cachePromise
  return planetResidentCache
}

function establishCache() {
  const getPeoplePromise = getPeopleCache()
  const getPlanetsPromise = getPlanetsCache()
  return Promise.all([getPeoplePromise, getPlanetsPromise])
}

function getPlanetsCache() {
  return axios.get(`${baseUrl}/planets`)
    .then(handleRes) // This will be called recursively until all pages have been fetched
    .then(establishPlanetResidentCache)
  function handleRes({data}) {
    planetCache = planetCache.concat(data.results)
    if (data.next) return axios.get(data.next).then(handleRes)
  }
}

function establishPlanetResidentCache () {
  const planetPromises = planetCache.map(({residents, name}) => {
    const residentsPromise = residents.map(residentUrl => axios.get(residentUrl).then(({data}) => data))
    return Promise.all(residentsPromise)
      .then(residents => planetResidentCache[name] = residents.map(({name}) => name))
  })
  Promise.all(planetPromises)
}

function getPeopleCache() {
  return axios.get(`${baseUrl}/people`)
    .then(handleRes)
  function handleRes({data}) {
    peopleCache = peopleCache.concat(data.results)
    if (data.next) return axios.get(data.next).then(handleRes)
  }
}
