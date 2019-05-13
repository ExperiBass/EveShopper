module.exports = getOrders
/** getOrders
 * This function uses the arguments passed to it to get the
 * buy or sell orders for the given item in the given region.
 * This function has the bulk of the code that powers EveShopper.
*/
const axios = require('axios')
const getStations = require('./getStations')
const err = require('./err')

async function getOrders(regID, buySell, itemID, array) {
  const Fetch = document.getElementById('Fetch')
  const table = document.getElementById('table')
  let content = ''
  let data;

  Fetch.disabled = true
  if (buySell == undefined) {
    Info.innerHTML = 'Choose either "Buy" or "Sell"!'
    setTimeout(function () {document.getElementById('Info').innerText = ''}, 4000)
    Fetch.disabled = false
    return
  }
  if (itemID == undefined) {
    Fetch.disabled = false
    Error('itemID is undefined!')
    return
  }

 /* if (array) {
    array.forEach(fetch)
  }*/

  async function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
  }
 // async function fetch(region) {
    // Getting the orders
      await axios.get(`https://esi.evetech.net/latest/markets/${regID}/orders/?datasource=tranquility&order_type=${buySell}&page=1&type_id=${itemID}`)
                  .then(response => { 
                    data = response.data
                  })
                  .catch(error => { 
                    err(error, 'Function: getOrders()')
                    Fetch.disabled = false
                    return
                  })

    let mOr;
    let dots;
    let j = 0
    
    for (let i = 0; i < data.length; i++, j++) {
      let currentData, station, price, remVol, minVol
      try {
        currentData = data[i]
        station = await getStations(currentData.location_id) // get the station name
        price = currentData.price // get the price of the item at the station
      }
      catch (error) {
        err(error, 'Function: getOrders()')
        Info.innerText = 'Uh oh, there was a error! Please try again, and if it continues to happen, open a issue on '
                          + 'my GitHub page with this error:' + error
        setTimeout(function () {document.getElementById('Info').innerText = ''}, 4000)
        Fetch.disabled = false
        return
      }

      switch (j) {
        case 1: 
          dots = '.'
          break
        case 2:
          dots = '..'
          break
        case 3:
          dots = '...'
          break
        default:
          dots = ''
          j = 0
      }

      if (station == undefined) {
        station = `Private Station`
      }

      switch (buySell){
        case 'buy':
        mOr = 'Remaining Volume'
          remVol = currentData.volume_remain
          info = `<tr>
                  <td>${station}</td>
                  <td>${price}</td> 
                  <td>${remVol}</td>
                  </tr>`
          // `info` is HTML, and generates a table to display the data
          break;
        case 'sell':
          mOr = 'Minimum Volume'
          minVol = currentData.min_volume
          info = `<tr><td>${station}</td>
                  <td>${price}</td>
                  <td>${minVol}</td>
                  </tr>`
          break;
      }
      
      if (mOr == undefined) {
        table.innerHTML = `<tr>
        <th>Station</th>
        <th>Price (ISK)</th> 
        <th></th>
        <th>Add to List</th>`
      } else if (mOr == 'Remaining Volume') {
          table.innerHTML = `<tr>
                          <th>Station</th>
                          <th>Price (ISK)</th> 
                          <th>${mOr}</th>
                          </tr><input type="button" value="Add To List" id="Add" onClick="addToList(${data[0].type_id})"/>`
      } else {
        table.innerHTML = `<tr>
                          <th>Station</th>
                          <th>Price (ISK)</th> 
                          <th>${mOr}</th>
                          </tr>`
      }
      Info.innerText = `Fetching orders${dots}`
      content += info
      await sleep(500) // pause on each iteration to avoid spamming the ESI Server
    }
    Info.innerText = ''
    if (content == '') { // if there are no orders...
      Info.innerText = `There are no ${buySell} orders for that in 
                      ${document.getElementById('Region').value}!` // ...alert the user...
      setTimeout(function () {document.getElementById('Info').innerText = ''}, 4000)
      Fetch.disabled = false
      return
    } else { // ...else...
    table.innerHTML += content
    Fetch.disabled = false
    document.getElementById('showHide').disabled = false // ...display the data
    }  
//  }
}