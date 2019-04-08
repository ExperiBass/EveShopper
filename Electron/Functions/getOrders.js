module.exports = getOrders

const axios = require('axios')
const getStations = require('./getStations')
const err = require('./err')

async function getOrders(regID, buySell, itemID) {
  const Info = document.getElementById('Info')
  const Fetch = document.getElementById('Fetch')
  const table = document.getElementById('table')
  var content = ''
  var data;

  // List of faction region IDs
  const amarrRegions = [
    10000054, // Aridia
    10000036, // Devoid
    10000043, // Domain
    10000067, // Genesis
    10000052, // Kador
    10000065, // Kor-Azor
    10000020, // Tash-Murkon
    10000038  // The Bleak Lands
    ]
  const caldariRegions = [
  10000016, // Lonetrek
  10000033, // The Citadel
  10000002, // The Forge
  10000069  // Black Rise
  ]
  const gallenteRegions = [
  10000064, // Essence
  10000037, // Everyshore
  10000048, // Placid
  10000032, // Sinq Laison
  10000044, // Solitude
  10000068  // Verge Vendor
  ]
  const minmatarRegions = [
  10000042, // Metropolis
  10000030, // Heimatar
  10000028  // Molden Heath
  ]
  const triglavianRegions = [] // Empty for now

  Fetch.disabled = true
  if (buySell == undefined) {
    Info.innerHTML = 'Choose either "Buy" or "Sell"!'
    Fetch.disabled = false
    return
  }
  if (itemID == undefined) {
    Fetch.disabled = false
    throw new Error('itemID is undefined!')
  }

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

                var j = 0
                var i = 0
                var mOr;
                
                try {
                var get = setInterval(getStations, 500, data[j].location_id)
                }
                catch (error) {
                  err(error, 'Function: getOrders()')
                  Fetch.disabled = false
                  return
                }
                var count = setInterval(incr, 510)
                var info;
                async function incr() {
                  j++
                  i++
                  var dots;
                  
                  switch (i) {
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
                      i = 0
                  }
                  if (j >= data.length) {
                    clearInterval(get)
                    clearInterval(count)
                    Info.innerText = ''
                    table.innerHTML = `<tr>
                                        <th>Station</th>
                                        <th>Price (ISK)</th> 
                                        <th>${mOr}</th>
                                        </tr>
                                        ${content}`
                    Fetch.disabled = false
                    return
                  }

                  Info.innerText = `Fetching data${dots}`
                  const currentData = data[j];
                  
                  var station = await getStations(currentData.location_id)
                  var price = currentData.price, remVol, minVol

                  if (station == undefined) {
                    station = `Private Station`
                  }

                  //j++
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
                      info = `<tr>
                              <td>${station}</td>
                              <td>${price}</td> 
                              <td>${minVol}</td>
                              </tr>`
                      break;
                  }
                  content += `${info}`
                }
}