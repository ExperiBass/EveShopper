module.exports = getOrders

const axios = require('axios')
const getStations = require('./getStations')
const err = require('./err')

async function getOrders(regID, buySell, itemID, array) {
  const Info = document.getElementById('Info')
  const Fetch = document.getElementById('Fetch')
  const table = document.getElementById('table')
  let content = ''
  let data;

  Fetch.disabled = true
  if (buySell == undefined) {
    Info.innerHTML = 'Choose either "Buy" or "Sell"!'
    Fetch.disabled = false
    return
  }
  if (itemID == undefined) {
    Fetch.disabled = false
    Error('itemID is undefined!')
    return
  }

  async function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
  }

  // Getting the orders (is a function to help clean code)
 // async function get(regID) {
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
                     station = await getStations(currentData.location_id)
                     price = currentData.price 
                  }
                  catch (error) {
                    err(error, 'Function: getOrders()')
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
                    </tr>`
                  } else {
                    table.innerHTML = `<tr>
                                      <th>Station</th>
                                      <th>Price (ISK)</th> 
                                      <th>${mOr}</th>
                                      </tr>`
                  }
                  Info.innerText = `Fetching data${dots}`
                  content += info
                  await sleep(500)
                }
                Info.innerText = ''
                if (content == '') {
                  Info.innerText = `There are no ${buySell} orders for that in 
                                  ${document.getElementById('Federation').value}!`
                  Fetch.disabled = false
                  return
                } else {
                table.innerHTML += content
                Fetch.disabled = false
                }
 // }
  /*for (let i = 0; i < array.length; i++) {
    console.log('hi')
    await get(array[i])
  }  
  get(array[1])
  if (content == '') {
    Info.innerText = `There are no ${buySell} orders for that in 
                    ${document.getElementById('Federation').value}!`
    Fetch.disabled = false
    return
  } else {
  table.innerHTML += content
  Fetch.disabled = false
  } */         
}