module.exports = getStations

const axios = require('axios')
const err = require('./err')

async function getStations(location) {

  let promiseName;

    // Get the stations location
    await axios.get(`https://esi.evetech.net/latest/universe/stations/${location}/?datasource=tranquility`)
                  .then(response => {
                    const data = response.data

                    promiseName = Promise.resolve(data.name)
                  })
                  .catch(error => { 
                    err(error, 'Function: getStations()')
                  })

return promiseName
}