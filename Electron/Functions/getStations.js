module.exports = getStations

const axios = require('axios')

async function getStations(location) {

    var info;
    var name = 'demo'
    // Get the stations location
    await axios.get('https://esi.evetech.net/latest/universe/stations/' + location + '/?datasource=tranquility')
          .then(response => {
            const data = response.data

             // name = data.name

          })
          .catch(error => {
          console.log(error)
          alert(error)
        })
        console.log(name) // this logs the name perfectly
    return name; // is passed back to `getOrders.js`
  }