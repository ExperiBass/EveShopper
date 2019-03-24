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
     await axios.get('https://esi.evetech.net/latest/markets/' + regID + '/orders/?datasource=tranquility&order_type=' + buySell +
                '&page=1&type_id=' + item)
          .then(response => {
              const data = response.data
              var info;

              var s = getStations(data[0].location_id)
              setTimeout(() => { console.log(s) }, 1000) // this returns a promise instead of the value of `name`

              /*for (var i = 0; i < data.length; i++) {
                var stations = setTimeout(() => { getStations(data[i].location_id) }, 1000)
                var prices = data[i].price
                info += '\n Station: ' + stations
              }*/
              //console.log(info)
          })
  }
