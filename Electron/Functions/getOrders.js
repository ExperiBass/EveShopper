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

                  //setTimeout(() => { getStations(data[0].location_id).then(function(value) { info += value; console.log(info) }) }, 1000)

                  //var volRem = data.volume_remain // for remaining volume of items in station (buy option only)

                 for (let i of data) {

                    var price = i.price
                    var volRem = i.volume_remain
                    var stations;

                    setTimeout(() => { getStations(i.location_id).then(function(value) { stations += value }) }, 1000)

                    console.log(price)
                    setTimeout(() => { info += '\n Station: ' + 
                    stations + ' Price: ' 
                    + price + ' Remaining volume: ' 
                    + volRem }, 1100)
                  }
                })
                .catch(error => {
                  console.log(error)
                  alert(error)
                })
}