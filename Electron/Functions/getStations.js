module.exports = getStations

const axios = require('axios')

async function getStations(location) {

  var name = 'demo'
  var promiseName;

    // Get the stations location
    await axios.get(`https://esi.evetech.net/latest/universe/stations/${location}/?datasource=tranquility`)
                  .then(response => {
                    const data = response.data
                    promiseName = Promise.resolve(data.name)

                  })
                  .catch(error => {
                  console.log(error)
                  alert(error)
                  })

return promiseName
}


/*var noPromises = function(url, callback){
  axios.get(url)
 .then(response => callback(null, response))
 .catch(error => callback(error))
}


noPromises(`https://esi.evetech.net/latest/markets/${regID}/orders/?datasource=tranquility&order_type=${buySell}&page=1&type_id=${item}`, (error, response) => {

 // data handling code here, with response. My check for error first.
 if (error) {
  alert(error.response)
  return
  }

 data = response.data
 
 var j = 0

                var get = setInterval(getStations, 1000, data[j].location_id)
                var count = setInterval(incr, 1010)
                
                async function incr() {

                  if (j > 24) {
                      clearInterval(get)
                      clearInterval(count)
                      return
                  }
                  const currentData = data[j];
                  var station = await getStations(currentData.location_id);
                  var price = currentData.price, remVol

                  j++
                  if (buySell == 'buy') {
                    remVol = currentData.volume_remain

                    console.log(`${j} , Location ID: ${currentData.location_id} Station: ${station}, 
                                Price: ${price} ISK, Remaining Volume: ${remVol}`)
                  } else {      
                    console.log(`${j} , Location ID: ${currentData.location_id} Station: ${station}, 
                    Price: ${price} ISK`)
                  }
                  
              }

})*/