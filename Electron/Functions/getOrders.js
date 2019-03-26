module.exports = getOrders

const axios = require('axios')
const getStations = require('./getStations')

async function getOrders(regID, buySell, itemID) {
  const fetch = document.getElementById('Fetch')

  fetch.disabled = true

  // checking if a radio button was pressed
  if (buySell == undefined) {
    document.getElementById('warning').innerHTML = 'Choose either "Buy" or "Sell"!'
    return;
  }
  var data;
  // Getting the orders
  await axios.get(`https://esi.evetech.net/latest/markets/${regID}/orders/?datasource=tranquility&order_type=${buySell}&page=1&type_id=${itemID}`)
                 .then(response => {

                  data = response.data
                  if (data.error) {
                    console.log("Log your error here:", data.error);
                    return;
                } 

                })
                .catch(error => {
                  console.log(error)
                })

                var j = 0

                var get = setInterval(getStations, 1000, data[j].location_id)
                var count = setInterval(incr, 1010)
                
                async function incr() {
                  j++
                  if (j >= data.length) {
                    clearInterval(get)
                    clearInterval(count)
                    fetch.disabled = false
                    return
                }
                  const currentData = data[j];
                  var station = await getStations(currentData.location_id);
                  var price = currentData.price, remVol, minVol

                  //j++
                  if (buySell == 'buy') {
                    remVol = currentData.volume_remain

                    console.log(`${j} , Location ID: ${currentData.location_id} Station: ${station}, 
                                Price: ${price} ISK, Remaining Items: ${remVol}`)
                  } else {      
                    minVol = currentData.min_volume
                    console.log(`${j} , Location ID: ${currentData.location_id} Station: ${station}, 
                    Price: ${price} ISK, Minimum Volume: ${minVol}`)
                  }
                  
              }
}