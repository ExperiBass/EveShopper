module.exports = getOrders

const axios = require('axios')
const getStations = require('./getStations')

async function getOrders(regID, buySell, item) {

  // checking if a radio button was pressed
  if (buySell == undefined) {
    document.getElementById('warning').innerHTML = 'Choose either "Buy" or "Sell"!'
    return;
  }

  // Getting the orders
  await axios.get('https://esi.evetech.net/latest/markets/' + 
                  regID + '/orders/?datasource=tranquility&order_type=' + 
                  buySell +
                  '&page=1&type_id=' + item)
                 .then(response => {

                  const data = response.data
                  var info;
                  
                  var volRem = data.volume_remain // for remaining volume of items in station (buy option only)

                  for (var i = 0; i < data.length; i++) {

                    var prices = data[i].price
                    console.log(data[i].location_id)
                    var stations;

                    setTimeout(() => { getStations(data[i].location_id).then(function(value) { stations += value }) }, 1000)


                    setTimeout(() => { info += '\n Station: ' + stations }, 1000)
                  }
                  //console.log(info)
                })
  }
