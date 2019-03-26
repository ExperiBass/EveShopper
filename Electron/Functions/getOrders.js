module.exports = getOrders

const axios = require('axios')
const getStations = require('./getStations')

async function getOrders(regID, buySell, itemID) {
  const fetch = document.getElementById('Fetch')
  var content = ''

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

  fetch.disabled = true
  if (buySell == undefined) {
    Info.innerHTML = 'Choose either "Buy" or "Sell"!'
    fetch.disabled = false
    return;
  }
  
  var data;
  // Getting the orders
  await axios.get(`https://esi.evetech.net/latest/markets/${regID}/orders/?datasource=tranquility&order_type=${buySell}&page=1&type_id=${itemID}`)
                 .then(response => {
                  if (response.error) {
                    console.log("Log your error here:", response.error);
                    return;
                  } 
                  data = response.data

                })
                .catch(error => {
                  console.log(error)
                })

                var j = 0
                var i = 0

                var get = setInterval(getStations, 1000, data[j].location_id)
                var count = setInterval(incr, 1010)
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
                    document.getElementById('Info').innerText = content
                    fetch.disabled = false
                    return
                  }

                  document.getElementById('Info').innerText = `Fetching data${dots}`
                  const currentData = data[j];
                  var station = await getStations(currentData.location_id);
                  var price = currentData.price, remVol, minVol

                  //j++
                  switch (buySell){
                    case 'buy':
                      remVol = currentData.volume_remain
                      info = `${j} , Location ID: ${currentData.location_id} Station: ${station}, 
                                    Price: ${price} ISK, Remaining Items: ${remVol}`
                      content += `${info}\n\n`
                      return
                    case 'sell':
                      minVol = currentData.min_volume
                      info = `${j}: Location ID: ${currentData.location_id} Station: ${station}, 
                      Price: ${price} ISK, Minimum Volume: ${minVol}`
                      content += `${info}\n\n`
                      return
                  }
                    
                }
}