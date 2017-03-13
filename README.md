# Grow SWAPI
### Scripts:
 - `npm start` - builds and runs the server.
 - `npm run watch` - builds and runs the server. File changes will cause a server restart.

### API
 - `GET /characters`: Returns a list of characters. Query defaults: `limit = 10`, `start = 1`, `sort = ''`, `asc = true`
 - `GET /characters/:name`: Returns one character. Will return a 404 if character is not found.
 - `GET /planetresidents`: Returns a list of planets, each with a list of their residents.
