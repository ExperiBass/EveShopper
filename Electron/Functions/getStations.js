module.exports = getStations
/** getStations
 * This function is only used in the try block on line 57 of getOrders.
 */
const axios = require('axios')
const err = require('./err')

async function getStations(locationID) {

  let promiseName;
	
	if (locationID < 1000000000000) {
		// Get the stations location
		await axios.get(`https://esi.evetech.net/latest/universe/stations/${locationID}/?datasource=tranquility`)
                  .then(response => {
                    const data = response.data

                    promiseName = Promise.resolve(data.name)
                  })
                  .catch(error => { 
                    err(error, 'Function: getStations()')
                  })
	} else {
		promiseName = "Upwell market";
	}

return promiseName
}