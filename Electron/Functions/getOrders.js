module.exports = getOrders
/** getOrders
 * This function uses the arguments passed to it to get the
 * buy or sell orders for the given item in the given federations space.
 * This function has the bulk of the code that powers EveShopper.
*/
const axios = require('axios')
const getStations = require('./getStations')
const err = require('./err')
const numeral = require('numeral')
const link = 'https://esi.evetech.net/latest/'

async function getOrders(buySell, itemID, array, fedName) {
  const Fetch = document.getElementById('Fetch')
  const Table = document.getElementById('table')
  let content = ''
  let data, regID;
  let regionNum;

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
    if (!array) {
      Error('undefined array')
      return;
    }
    for (let i = 0; i < array.length; i++) {
      regID = array[i]
      regionNum = ++i
      console.log(regID)
      await fetch()
    } 
    if (content == '') { // if there are no orders...
      Info.innerText = `There are no ${buySell} orders for that in 
                      ${fedName} space!` // ...alert the user...
      setTimeout(function () {document.getElementById('Info').innerText = ''}, 4000)
      Fetch.disabled = false
      return // ...and exit...
    } else { // ...else...
    Table.innerHTML += content
    Fetch.disabled = false // ...display the data
    }

  async function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
  }
  async function fetch() {
    // Getting the orders
      await axios.get(`${link}markets/${regID.id}/orders/?datasource=tranquility&order_type=${buySell}&page=1&type_id=${itemID}`)
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
        price = `${numeral(currentData.price).format('0,0.00')} ISK` // get the price of the item at the station
      }
      catch (error) {
        err(error, 'Function: getOrders()')
        Info.innerText = 'Uh oh, there was a error! Please try again, and if it continues to happen, open a issue on '
                          + 'my GitHub page with this error:' + error
        setTimeout(function () {document.getElementById('Info').innerText = ''}, 80000)
        Fetch.disabled = false
        return
      }

      if (station == undefined) {
        station = `Upwell Structure`
      }

      switch (buySell){
        case 'buy':
        mOr = 'Minimum Volume'
          minVol = currentData.min_volume
          info = `<tr>
                  <td>${station}</td>
                  <td>${price}</td> 
                  <td>${minVol}</td>
                  </tr>`
          // `info` is HTML, and generates a table to display the data
          break;
        case 'sell':
          mOr = 'Remaining Volume'
          remVol = currentData.volume_remain 
          info = `<tr><td>${station}</td>
                  <td>${price}</td>
                  <td>${remVol}</td>
                  </tr>`
          break;
      }
      
      if (mOr == undefined) {
        Table.innerHTML = `<tr>
        <th>Station</th>
        <th>Price</th> 
        <th>Remaining/Minimum Volume</th>`
      } else if (mOr == 'Remaining Volume') {
          Table.innerHTML = `<tr>
                          <th>Station</th>
                          <th>Price</th> 
                          <th>${mOr}</th>
                          </tr><input type="button" value="Add To List" id="Add" onClick="addToList(${data[0].type_id})"/><hr />`
      } else {
        Table.innerHTML = `<tr>
                          <th>Station</th>
                          <th>Price</th> 
                          <th>${mOr}</th>
                          </tr>`
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
      Info.innerText = `Fetching orders in ${regID.name} (this may take a while (Region ${regionNum} of ${array.length}))${dots}` // Display the region 
                                                                                       // the app is getting orders from
      content += info
      
      await sleep(150) // pause on each iteration to avoid spamming the ESI Server
    }
    Info.innerText = ''
  }

}