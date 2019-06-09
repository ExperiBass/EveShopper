module.exports = getItem
/** getItem
 * This function takes the value of the text fields and the radio buttons and converts them to 
 * useable values that getOrders can use.
 */

const axios = require('axios')
const getOrders = require('./getOrders')
const err = require('./err')
const link = 'https://esi.evetech.net/latest/'

function getItem(iSearch, bOs) {
    let item; // Item ID
    let fedName;
    let buySell; // Will be either "buy", "sell", or undefined
    const Info = document.getElementById('Info')
    const alertUser = require('./info')
    let federation = document.getElementById('fedList').value
    // List of faction region IDs
    const amarrRegions = [
        {id: 10000054, name: 'Aridia'}, // Aridia
        {id: 10000036, name: 'Devoid'}, // Devoid
        {id: 10000043, name: 'Domain'}, // Domain
        {id: 10000067, name: 'Genesis'}, // Genesis
        {id: 10000052, name: 'Kador'}, // Kador
        {id: 10000065, name: 'Kor-Azor'}, // Kor-Azor
        {id: 10000020, name: 'Tash-Murkton'}, // Tash-Murkon
        {id: 10000038, name: 'The Bleak Lands'} // The Bleak Lands
    ]
    const caldariRegions = [
        {id: 10000016, name: 'Lonetrek'}, // Lonetrek
        {id: 10000033, name: 'The Citadel'}, // The Citadel
        {id: 10000002, name: 'The Forge'}, // The Forge
        {id: 10000069, name: 'Black Rise'} // Black Rise
    ]
    const gallenteRegions = [
        {id: 10000064, name: 'Essence'}, // Essence
        {id: 10000037, name: 'Everyshore'}, // Everyshore
        {id: 10000048, name: 'Placid'}, // Placid
        {id: 10000032, name: 'Sinq Laison'}, // Sinq Laison
        {id: 10000044, name: 'Solitude'}, // Solitude
        {id: 10000068, name: 'Verge Vendor'} // Verge Vendor
    ]
    const minmatarRegions = [
        {id: 10000042, name: 'Metropolis'}, // Metropolis
        {id: 10000030, name: 'Heimatar'}, // Heimatar
        {id: 10000028, name: 'Molden Heath'} // Molden Heath
    ]
    const triglavianRegions = [] // Empty for now
    let array;

    // Checking for valid item
    if (iSearch == '') {
        alertUser(`You didn't give a item to get the prices of!`)
        return
    }

    switch (federation) {
        case 'caldari':
            array = caldariRegions.slice(0)
            fedName = 'Caldari'
            break;
        case 'amarr':
            array = amarrRegions.slice(0)
            fedName = 'Amarr'
            break;
        case 'gallente':
            array = gallenteRegions.slice(0)
            fedName = 'Gallente'
            break;
        case 'minmatar':
            array = minmatarRegions.slice(0)
            fedName = 'Minmatar'
            break;
        case 'triglavian':
            // array = triglavianRegions.slice(0)
            Info.innerText = 'There are no Triglavian regions as of right now!'
            setTimeout(function() {
                document.getElementById('Info').innerText = ''
            }, 4000)
            break;
    }

    // getting the item ID
    axios.get(`${link}search/?categories=inventory_type&datasource=tranquility&language=en-us&search=${iSearch}&strict=true`)
        .then(response => {
            try {
                const data = response.data
                item = data.inventory_type[0]
            } catch { // if `data.inventory_type[0]` doesnt exist, this block is run
                alertUser(`That's not a valid item!`)
                err('Invalid Item')
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

            // call getOrders and pass the region ID, the radio button that was clicked, and the item ID
            getOrders(buySell, item, array, fedName)
        })
        .catch(error => {
            err(error, 'Function: getItem()')
            return
        })
}