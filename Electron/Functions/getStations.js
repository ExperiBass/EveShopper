module.exports = getStations

const axios = require('axios')

async function getStations(location) {

  var name = 'demo'
  var promiseName;

    // Get the stations location
    await axios.get('https://esi.evetech.net/latest/universe/stations/' + location + '/?datasource=tranquility')
                  .then(response => {
                    const data = response.data

                      //promiseName = data.name
                    promiseName = Promise.resolve(data.name)
                    console.log(name)
                  })
                  .catch(error => {
                  console.log(error)
                  alert(error)
                  })

       /* promiseName.then(function(value) {
          console.log('line 22: ' + value)
          name = value
          console.log('Line 24: ' + name)
        })*/

  setTimeout(() => { return name }, 100) // this logs the name perfectly

/* function returnV(a) {
  console.log('from `returnV`: ' + a)
  return a // is passed back to `getOrders.js`
}*/

}