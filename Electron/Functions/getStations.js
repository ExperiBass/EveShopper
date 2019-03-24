module.exports = getStations

const axios = require('axios')

async function getStations(location) {

  var name = 'demo'
  var promiseName;

    // Get the stations location
    await axios.get('https://esi.evetech.net/latest/universe/stations/' + location + '/?datasource=tranquility')
                  .then(response => {
                    const data = response.data
                    console.log(data)
                    promiseName = Promise.resolve(data.name)

                  })
                  .catch(error => {
                  console.log(error)
                  alert(error)
                  })

return promiseName
}