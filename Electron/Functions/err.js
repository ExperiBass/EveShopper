module.exports = err

function err(error, info) {

        console.log('caught: ', error.message)
        if (info) {
          const msg = `Error: ${error}, Info: ${info}`
          Error(msg)
         // alert(`Please report this to the dev, along with what you searched for and what region! \n\n${error}\n${info}`)
        } else {
          Error(error)
       // alert(`Please report this to the dev, along with what you searched for and what region! \n\n${error}`)
        }
}