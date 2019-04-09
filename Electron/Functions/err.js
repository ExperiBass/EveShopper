module.exports = err

function err(error, info) {

        console.log('caught: ', error)
        if (info) {
          const msg = `Error: ${error}, Info: ${info}`
          new Error(msg)        
        } else {
          new Error(error)
        }
}