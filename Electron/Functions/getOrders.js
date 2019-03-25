module.exports = getOrders

const axios = require('axios')
const getStations = require('./getStations')

async function getOrders(regID, buySell, item) {

  // checking if a radio button was pressed
  if (buySell == undefined) {
    document.getElementById('warning').innerHTML = 'Choose either "Buy" or "Sell"!'
    return;
  }
  var data;
  // Getting the orders
  await axios.get(`https://esi.evetech.net/latest/markets/${regID}/orders/?datasource=tranquility&order_type=${buySell}&page=1&type_id=${item}`)
                 .then(response => {

                  data = response.data

                })
                .catch(error => {
                  console.log(error.response.data)
                })

                var j = 20

                var get = setInterval(getStations, 1000, data[j].location_id)
                var count = setInterval(incr, 1010)
                
                async function incr() {
                  j++
                  if (j > 24) {
                    clearInterval(get)
                    clearInterval(count)
                    return
                }
                  const currentData = data[j];
                  var station = await getStations(currentData.location_id);
                  var price = currentData.price, remVol, minVol

                  //j++
                  if (buySell == 'buy') {
                    remVol = currentData.volume_remain

                    console.log(`${j} , Location ID: ${currentData.location_id} Station: ${station}, 
                                Price: ${price} ISK, Remaining Volume: ${remVol}`)
                  } else {      
                    sminVol = currentData.min_volume
                    console.log(`${j} , Location ID: ${currentData.location_id} Station: ${station}, 
                    Price: ${price} ISK, Minimum Volume: ${minVol}`)
                  }
                  
              }
}