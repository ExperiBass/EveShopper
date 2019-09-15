module.exports = getOrders

const esiJS = require('esijs')
const numeral = require('numeral')
const err = require('./err')
const alertUser = require('./alertUser')
/** getOrders
 * This function uses the arguments passed to it to get the
 * buy or sell orders for the given item in the given federations space.
 * This function has the bulk of the code that powers EveShopper.
*/
async function getOrders(buySell, itemID, array, fedName) {
  const Fetch = document.getElementById('Fetch')
  const Table = document.getElementById('table')
  let content = ''
  let data, regID, regionNum

  Fetch.disabled = true

  if (buySell == undefined) {
    alertUser(`Choose either "Buy" or "Sell"!`)
    Fetch.disabled = false
    return
  }

  if (itemID == undefined) {
    Fetch.disabled = false
    alert(`There was a error! Please report the error below on the GitHub page! \n ERROR:\n"itemID is undefined."\nFunction: getItem\nLine: 89`, 8000)
    Error('itemID is undefined!')
    return
  }
  if (!array) {
    Error('undefined array')
    return;
  }
  for (let i = 0; i < array.length; i++) {
    regID = array[i]
    regionNum = i + 1
    await fetch()
  } 
  if (content == '') { // if there are no orders...
    alertUser(`There are no ${buySell} orders for that in ${fedName} space!`)  // ...alert the user...
    Fetch.disabled = false
    return // ...and exit.
  } else { // Else...
  Table.innerHTML += content
  Fetch.disabled = false // ...display the data

  }
  await esiJS.util.sleep(50)

  let notif = new Notification('EveShopper', {
    body: `The ${buySell} orders you have requested are ready!`
  })

  notif.onclick = () => {
    console.log('Notification clicked')
  }

  
  async function fetch() {
    // Getting the orders
    let data = await esiJS.market.orders(regID.id, itemID, buySell, 1)
                        .catch(function(e) {
                          console.error(e)
                          return false
                        })

    let mOr;
    let dots;
    let j = 0
    
    for (let i = 0; i < data.length; i++, j++) {
      let currentData, station, price, remVol, minVol
      try {
        currentData = data[i]
        let search = await esiJS.universe.stations.stationInfo(currentData.location_id)
                              .catch(function(e) {
                                console.error(e)
                                return false
                              })
        station = search.name // get the station name
        price = `${numeral(currentData.price).format('0,0.00')} ISK` // get the price of the item at the station
      }
      catch (error) {
        err(error, 'Function: getOrders()')
        alert(`Uh oh, there was a error! Please try again, and if it continues to happen, open a issue on my GitHub page with this error:\n ${error}`)
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
      
      switch (mOr) {
        case undefined: 
          Table.innerHTML = `<tr>
          <th>Station</th>
          <th>Price</th> 
          <th>Remaining/Minimum Volume</th>`
          break;
        case 'Remaining Volume':
            Table.innerHTML = `<tr>
            <th>Station</th>
            <th>Price</th> 
            <th>${mOr}</th>
            </tr><input type="button" value="Add To List" id="Add" onClick="addToList(${data[0].type_id})"/><hr />`
            break;
        default:
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

      Info.innerText = `Fetching orders in ${regID.name} (this may take a while (Region ${regionNum} of ${array.length}))${dots}` 
                        // Display the region the app is getting orders from
      content += info
      
      await esiJS.util.sleep(50) // pause on each iteration to avoid spamming the ESI Server
    }

    Info.innerText = ''
  }

}