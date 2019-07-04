module.exports = err

function err(error, info) {
        if (info) {
          const msg = `Error: ${error}, Info: ${info}`
          return Error(msg)        
        } else {
          return Error(error)
        }

}