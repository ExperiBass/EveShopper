module.exports = getMarketItems

let axios = require('axios')
const link = 'https://esi.evetech.net/latest/'
let marketItems = []
async function sleep(millis) {
    return new Promise(resolve => setTimeout(resolve, millis));
  }

 async function getMarketItems() {
    let marketGroups = []
    let data;

     axios.get(`${link}markets/groups/?datasource=tranquility`)
        .then(response => {
            data = response.data
            marketGroups = data.slice(0)
            
            for (let i = 0; i < marketGroups.length; i++) {
                 axios.get(`${link}markets/groups/${marketGroups[i]}/?datasource=tranquility&language=en-us`)
                    .then(response => {
                        let data = response.data
                        let IDs = data.types

                        if (IDs == []) {
                            return
                        }

                        for (let j = 0; j < IDs; j++) {
                             axios.get(`${link}universe/types/${IDs[j]}/?datasource=tranquility&language=en-us`)
                                .then(response => {
                                    let data = response.data
                                    marketItems.push(data.name)
                                })
                           await sleep(150)
                        }
                    })
            }
        })
        .catch(error => {
            console.log(error)
            return
        })

}

console.log(getMarketItems())