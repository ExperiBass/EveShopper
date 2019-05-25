module.exports = getMarketItems

let axios = require('axios')
const err = require('./err')
const link = 'https://esi.evetech.net/latest/'
let marketItems = []
async function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
  }

 async function getMarketItems() {
    let marketGroups = []
    let data;

     axios.get(`${link}markets/groups/?datasource=tranquility`)
        .then(async (response) => {
            data = response.data
            marketGroups = data.slice(0)
            console.log(marketGroups.length)
            
            for (let i = 0; i < marketGroups.length; i++) {
                 axios.get(`${link}markets/groups/${marketGroups[i]}/?datasource=tranquility&language=en-us`)
                    .then(response => {
                        let data = response.data
                        let IDs = data.types
                        //console.log(IDs)
                        
                        getNames(IDs)
                    }).catch( e => { console.error(e) } )
                await sleep(200)
            }
        })
        .catch( e => { console.error(e) } )

}

async function getNames(array) {

    if (array[0] = undefined || null) {
        return
    }
    let res = await axios.post(`${link}universe/names/?datasource=tranquility`, array)
    
    for (let j = 0; j < res.data; j++) {
        marketItems.push(res.data[j].name)
        console.log(marketItems)
    }
}
console.log(getMarketItems())