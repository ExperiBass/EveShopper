module.exports = getItem

const axios = require('axios')
const getOrders = require('./getOrders')
const err = require('./err')

function getItem(iSearch, region, bOs) {
  let item; // Item ID
  let regID; // Region ID
  let buySell; // Will be either "buy", "sell", or undefined
  const Info = document.getElementById('Info')

  // Checking for region and item
  if (region == '') {
    Info.innerText = 'You didn\'t give a region!'
    return;
  }
  if (iSearch == '') {
    Info.innerText = 'You didn\'t give a item to get the prices of!'
    return;
  }

  // getting the item ID
  axios.get(`https://esi.evetech.net/latest/search/?categories=inventory_type&datasource=tranquility&language=en-us&search=${iSearch}&strict=true`)
          .then(response => {
            try {
              const data = response.data
              item = data.inventory_type[0]
            } catch {
              Info.innerText = 'That\'s not a valid item!'
              err('Invalid Item')
              return
          }
          })
          .catch(error => { 
            err(error, 'Function: getItem()')
            return
          })
  
      //getting region id
  axios.get(`https://esi.evetech.net/latest/search/?categories=region&datasource=tranquility&language=en-us&search=${region}&strict=true`)
          .then(response => {

            const data = response.data
            try {
              regID = data.region[0]
            } catch {
              Info.innerText = 'Thats not a valid region!'
              err('Invalid Region')
              return
            }
            
            // checking which radio button was selected
            for (let i = 0, length = bOs.length; i < length; i++) {
              if (bOs[i].checked) {
                // assign buySell the value of the checked radio
                buySell = bOs[i].value
                
                // only one radio can be logically checked, don't check the rest
                break;
              }
            }
            getOrders(regID, buySell, item)
          })
          .catch(error => { 
            err(error, 'Function: getItem()')
            return
          })
}